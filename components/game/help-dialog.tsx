import { Keyboard, MousePointer2, RefreshCw } from "lucide-react";
import { Modal } from "@/components/ui/modal";

export function HelpDialog({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="A familiar little game." onClose={onClose} className="help-dialog">
      <p className="modal-description">
        Classic tic-tac-toe, with two new faces. You and a friend share this screen.
      </p>
      <ol className="rules-list">
        <li>
          <MousePointer2 aria-hidden="true" />
          <div>
            <strong>Take turns placing your character.</strong>
            <p>Moon and Bloom each claim one empty square at a time.</p>
          </div>
        </li>
        <li>
          <span className="three-symbol" aria-hidden="true">
            3
          </span>
          <div>
            <strong>Connect three to win.</strong>
            <p>Across, down, or diagonally. A full board with no line is a draw.</p>
          </div>
        </li>
        <li>
          <RefreshCw aria-hidden="true" />
          <div>
            <strong>Stay for one more round.</strong>
            <p>
              The starting player alternates. Your board and scores save on this browser when
              storage is available.
            </p>
          </div>
        </li>
        <li>
          <Keyboard aria-hidden="true" />
          <div>
            <strong>A keyboard works too.</strong>
            <p>
              Tab to a square, navigate with arrow keys, then press Enter or Space. Escape closes
              popups.
            </p>
          </div>
        </li>
      </ol>
      <button autoFocus className="primary-button" onClick={onClose}>
        Let&apos;s play
      </button>
    </Modal>
  );
}
