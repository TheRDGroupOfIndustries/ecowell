import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import MyUploader from "@/CommonComponents/CommonDropzone";
import { Card, CardBody, FormGroup, Input, Label } from "reactstrap";

const GeneralForm = () => {
  return (
    <Card>
      <CommonCardHeader title="General" />
      <CardBody>
        <div className="digital-add needs-validation">
          <FormGroup>
            <Label className="col-form-label pt-0">
              <span>*</span> Title
            </Label>
            <Input id="validationCustom01" type="text" required />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">
              <span>*</span> SKU
            </Label>
            <Input id="validationCustom02" type="text" required />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label">
              <span>*</span> Categories
            </Label>
            <select className="form-select" required>
              <option value="">--Select--</option>
              <option value="1">eBooks</option>
              <option value="2">Graphic Design</option>
              <option value="3">3D Impact</option>
              <option value="4">Application</option>
              <option value="5">Websites</option>
            </select>
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label">Sort Summary</Label>
            <textarea rows={4} cols={12}></textarea>
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label">
              <span>*</span> Product Price
            </Label>
            <Input id="validationCustom02" type="text" required />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label">
              <span>*</span> Status
            </Label>
            <div className="m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
              <Label className="d-block">
                <Input className="radio_animated" id="edo-ani" type="radio" name="rdo-ani" />
                Enable
              </Label>
              <Label className="d-block">
                <Input className="radio_animated" id="edo-ani1" type="radio" name="rdo-ani" />
                Disable
              </Label>
            </div>
          </FormGroup>
          <Label className="col-form-label pt-0"> Product Upload</Label>
          <MyUploader />
        </div>
      </CardBody>
    </Card>
  );
};

export default GeneralForm;
