import classNames from "classnames";

interface ScheduleProps {
  schedule: any;
  checked: boolean;
}
const ScheduleCard: React.FC<ScheduleProps> = ({ checked, schedule }) => (
  <div
    className={classNames(
      "relative p-4 rounded cursor-pointer group hover:border-accent shadow-sm",
      {
        "border border-heading": checked,
        "bg-gray-200 border-gray-100": !checked,
      }
    )}
  >
    <span className="text-sm text-heading font-semibold block mb-2">
      {schedule.title}
    </span>
    <span className="text-sm text-heading block">{schedule.description}</span>
  </div>
);

export default ScheduleCard;
