import Modal from 'react-modal';
import './WarningPrompt.css';

interface Props {
  isOpen: boolean;
  clearInitiativeQueue: (confirmation:boolean) => void;
}

export default function WarningPrompt(props: Props) {
  return (
    <Modal isOpen={props.isOpen}
     className='warningModal'>
      <div className='warningModalInformation'>
        <h4>Attention! This will clear all information about the initiative queue. The effects information will not be cleared.</h4>
      </div>
      <div className='warningModalButtonsContainer'>
        <button onClick={()=>props.clearInitiativeQueue(true)} className='warningModalConfirmButton'>Confirm</button>
        <button onClick={()=>props.clearInitiativeQueue(false)} className='warningModalCancelButton'>Cancel</button>
      </div>
    </Modal>
  )
}
