/**
 * @license
 * This file is part of Hacklily, a web-based LilyPond editor.
 * Copyright (C) 2017 - present Joshua Netterfield <joshua@nettek.ca>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA
 */

import { css } from "aphrodite";
import React from "react";
import { FormattedMessage, InjectedIntl, injectIntl } from "react-intl";
import ReactModal from "react-modal";

import RPCClient from "../RPCClient";
import { MODAL_STYLE } from "../styles";

interface Props {
  intl: InjectedIntl;
  rpc: RPCClient;
  onHide(): void;
}

class MusicXML2LyModal extends React.PureComponent<Props> {
  render(): JSX.Element {
    const {
      intl: { formatMessage },
    } = this.props;
    return (
      <ReactModal
        className={css(MODAL_STYLE.modal)}
        contentLabel={formatMessage({
          id: "MusicXML2LyModal.title",
          defaultMessage: "Import MusicXML",
        })}
        isOpen={true}
        onRequestClose={this.props.onHide}
        overlayClassName={css(MODAL_STYLE.overlay)}
      >
        <div>
          <div className={css(MODAL_STYLE.modalHeader)}>
            <strong>
              <FormattedMessage
                id="MusicXML2LyModal.title"
                defaultMessage="Import MusicXML"
              />
            </strong>
            <button
              aria-label={formatMessage({
                id: "MusicXML2LyModal.back",
                defaultMessage: "Back to song",
              })}
              onClick={this.props.onHide}
              className={css(MODAL_STYLE.closeButton)}
            >
              <i className="fa-close fa" aria-hidden={true} />
            </button>
          </div>
          <div className={css(MODAL_STYLE.modalBody)}>
            <p style={{ marginTop: 0 }}>
              <input type="file" value="" onChange={this.convert} />
            </p>
          </div>
        </div>
      </ReactModal>
    );
  }

  convert = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!ev.target.files) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.doLoad(reader.result as any);
      delete reader.onload;
    };
    reader.readAsText(ev.target.files[0]);
  };

  doLoad = async (src: string) => {
    console.log(src);
    const rendered = await this.props.rpc.call("render", {
      backend: "musicxml2ly",
      src,
    });
    const file = rendered.result.files[0];
    alert(rendered.result.logs);
    location.href = `/#src=${encodeURIComponent(file)}`;
  };
}

export default injectIntl(MusicXML2LyModal);
