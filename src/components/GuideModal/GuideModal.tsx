import Modal from 'react-modal';
import './GuideModal.css';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

export default function GuideModal(props: Props): React.JSX.Element {
  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.closeModal}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      className='guideModal'
    >
      <div className='guideCloseContainer'>
        <button onClick={props.closeModal} className='guideCloseButton'>X</button>
      </div>
      <div className='guideContent'>
        <h2 className='guideTitle'>How to use the tracker</h2>

        <section className='guideSection'>
          <h3>Turn flow</h3>
          <ul>
            <li>Click <strong>Next</strong> (or press <strong>Space</strong> / <strong>→</strong>) to advance to the next combatant.</li>
            <li>Press <strong>←</strong> / <strong>Backspace</strong> to step back.</li>
            <li>Wrapping past the last combatant increments the round and ticks down effect durations.</li>
          </ul>
        </section>

        <section className='guideSection'>
          <h3>Managing characters</h3>
          <ul>
            <li><strong>Add character</strong> opens the editor. Set a <strong>Count</strong> to add several copies at once (auto-numbered, e.g. "Goblin 2", "Goblin 3").</li>
            <li>Click a character in the list to edit its stats, HP and effects, or to reorder it.</li>
            <li><strong>Sort by initiative</strong>, <strong>Reset round</strong> and <strong>Clear all</strong> live in the control section. Use the dice box to roll ad-hoc.</li>
          </ul>
        </section>

        <section className='guideSection'>
          <h3>Formulas (dice box, Hitpoints, Initiative)</h3>
          <ul>
            <li>All three accept either a <strong>whole number</strong> (e.g. <code>12</code>) or a <strong>dice formula</strong>.</li>
            <li>A formula is dice terms and/or flat numbers joined with <code>+</code> / <code>-</code>: <code>2d8+2</code>, <code>1d20-1</code>, <code>3d6+1d4+2</code>.</li>
            <li>Each dice term is <code>NdM</code> — <code>N</code> dice with <code>M</code> sides (<code>N</code> &ge; 1, <code>M</code> &ge; 2).</li>
            <li>When adding multiple copies, formulas are <strong>rolled independently per copy</strong>; flat numbers are identical across copies.</li>
            <li>Invalid input (decimals, letters, malformed dice) is rejected.</li>
          </ul>
        </section>
      </div>
    </Modal>
  );
}
