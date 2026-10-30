import { DISCLAIMER_IMAGE } from '../config';

/** Healthcare-professional disclaimer and company details, pinned to the bottom of the stage. */
export function Disclaimer() {
  return (
    <div className="disclaimer">
      <img src={DISCLAIMER_IMAGE} alt="For further information, please contact your healthcare professional. Zuellig Pharma Sdn Bhd." />
    </div>
  );
}
