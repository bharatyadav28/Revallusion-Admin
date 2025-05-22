import CountUp from "react-countup";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/hooks/use-redux";
import { useGetPlansQuery } from "@/store/apis/content-mangement/plans-apis";
import { setSelectedPlan } from "@/store/features/selectedPlanSlice";

interface Props {
  name: string;
  count: number;
  color: string;
  index: number;
  href: string;
}
function DashboardItem({ name, count, color, index, href }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: plansData } = useGetPlansQuery();

  const plans = plansData?.data?.plans;

  const handleClick = () => {
    if (name == "Active Beginner") {
      let plan = plans?.find((plan) => plan.level == 1);
      if (plan) dispatch(setSelectedPlan(plan._id));
    } else if (name == "Active Advanced") {
      let plan = plans?.find((plan) => plan.level == 2);
      if (plan) dispatch(setSelectedPlan(plan._id));
    }
    navigate(href);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.2,
      }}
      onClick={handleClick}
    >
      <motion.div
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring" }}
        className="w-full flex flex-col bg-[hsl(var(--border))] rounded-sm items-center py-8 gap-2 cursor-pointer"
      >
        <div className={`text-2xl `} style={{ color: color }}>
          <CountUp end={count} />
        </div>
        <div>{name}</div>
      </motion.div>
    </motion.div>
  );
}

export default DashboardItem;
