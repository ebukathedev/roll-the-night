import { forwardRef } from 'react';
import BallMachine from './BallMachine';

const MachineStage = forwardRef(function MachineStage({ airTarget }, ref) {
  return (
    <section className="machine-stage" aria-label="Lottery machine stage">
      <BallMachine ref={ref} airTarget={airTarget} />
      <div className="machine-chute" aria-hidden="true" />
    </section>
  );
});

export default MachineStage;

