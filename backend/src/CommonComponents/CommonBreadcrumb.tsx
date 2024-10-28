import { CommonBreadcrumbType } from "@/Types/Layout";
import Link from "next/link";
import { Home } from "react-feather";
import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from "reactstrap";

const CommonBreadcrumb = ({ title, parent, element }: CommonBreadcrumbType) => {
  return (
    <Container fluid>
      <div className="page-header">
        <Row>
          <Col lg="6">
            <div className="page-header-left d-flex flex-column gap-2 align-items-start">
              <h3>
                {title}
              </h3>
              <Breadcrumb className=" pull-right">
              <BreadcrumbItem>
                <Link href="/dashboard">
                  <Home />
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>{parent}</BreadcrumbItem>
              <BreadcrumbItem className=" active">{title}</BreadcrumbItem>
            </Breadcrumb>
            </div>
          </Col>
          <Col lg="6">
            {element}
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default CommonBreadcrumb;
