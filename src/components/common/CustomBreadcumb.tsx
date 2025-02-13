import { Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  list: {
    pageTraces: {
      name: string;
      href: string;
    }[];
    currentPage: string;
  };
}
const CustomBreadcumb = ({ list }: Props) => {
  return (
    <Breadcrumb className="mb-2">
      <BreadcrumbList>
        {list?.pageTraces?.map((pageTrace) => {
          return (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink className="text-sm" asChild>
                  <Link to={pageTrace.href} relative="path">
                    {pageTrace.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          );
        })}

        <BreadcrumbItem>
          <BreadcrumbPage className="text-sm">
            {list?.currentPage}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcumb;
