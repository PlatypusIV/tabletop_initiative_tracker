import Modal from 'react-modal';
import settings from '../../utils/settings.json';
import './DonateModal.css';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

export default function DonateModal(props: Props): React.JSX.Element {
  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.closeModal}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      className='donateModal'
    >
      <div className='donateCloseContainer'>
        <button onClick={props.closeModal} className='donateCloseButton'>X</button>
      </div>
      <div className='donateContent'>
        <h2 className='donateTitle'>Support the tracker</h2>

        <section className='donateSection'>
          <p>
            Gamemaster Tracker is free and made in spare time. If it saves you prep
            at the table and you'd like to chip in, anything is appreciated — and
            entirely optional.
          </p>
        </section>

        <section className='donateSection'>
          <div className='donateLinks'>
            <a className='donateLink kofi' href={settings.donation_links.kofi}
               target='_blank' rel='noopener noreferrer'>Ko-fi</a>
            <a className='donateLink bmac' href={settings.donation_links.buyMeACoffee}
               target='_blank' rel='noopener noreferrer'>Buy Me a Coffee</a>
            <a className='donateLink paypal' href={settings.donation_links.paypal}
               target='_blank' rel='noopener noreferrer'>PayPal</a>
          </div>
        </section>

        <section className='donateSection'>
          <p className='donateThanks'>Thank you for playing. 🎲</p>
        </section>
      </div>
    </Modal>
  );
}
