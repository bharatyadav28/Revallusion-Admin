import { useEffect } from "react";

// import WorkInProgress from "@/components/common/WorkInProgress";
import { PageLoadingSpinner } from "@/components/common/LoadingSpinner";
import { useGetDashboardDataQuery } from "@/store/apis/dashboard-apis";
import { showError } from "@/lib/reusable-funs";
import DashboardItem from "@/components/DashboardItem";

function Home() {
  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetDashboardDataQuery();

  const dashboardData = data?.data;

  const getActiveOrderCount = (planName: string) => {
    return dashboardData?.activeOrder?.find(
      (order) => order.planName === planName
    )?.usersCount;
  };

  const dataList = [
    {
      name: "Users",
      count: dashboardData?.usersCount,
      color: "#ADD8E6",
      href: "/users",
    },
    {
      name: "Active Beginner",
      count: getActiveOrderCount("Beginner"),
      color: "#90EE90",
      href: "/users",
    },
    {
      name: "Active Advanced",
      count: getActiveOrderCount("Advanced"),
      color: "#F08080",
      href: "/users",
    },
    {
      name: "Upgraded Plan",
      count: dashboardData?.plansUpgraded,
      color: "#FFB6C1",
      href: "#",
    },
    {
      name: "Today's Revenue",
      count: dashboardData?.revenues.daily,
      color: "#FFA07A",
      href: "#",
    },
    {
      name: "Weekly Revenue",
      count: dashboardData?.revenues.weekly,
      color: "#FAFAD2",
      href: "#",
    },
    {
      name: "Monthly Revenue",
      count: dashboardData?.revenues.monthly,
      color: "#E6E6FA",
      href: "#",
    },
    {
      name: "Yearly Revenue",
      count: dashboardData?.revenues.yearly,
      color: "#FFE4E1",
      href: "#",
    },
    {
      name: "Queries",
      count: dashboardData?.queries,
      color: "#87CEFA",
      href: "/queries",
    },
  ];

  // Show error
  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);

  return (
    <div className="mt-2">
      {!isLoading && (
        <div className="grid md:grid-cols-4  grid-cols-2 gap-4">
          {dataList?.map((item, index) => (
            <DashboardItem
              key={item.name}
              name={item.name}
              count={item?.count || 0}
              color={item?.color || "#fff"}
              index={index}
              href={item.href}
            />
          ))}
        </div>
      )}
      {isLoading && <PageLoadingSpinner />}
    </div>
  );

  // return <WorkInProgress />;
}

export default Home;
