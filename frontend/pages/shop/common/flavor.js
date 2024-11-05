import React, { useState, useContext } from "react";
import { Collapse, Input } from "reactstrap";
import FilterContext from "../../../helpers/filter/FilterContext";

const Flavor = () => {
  const context = useContext(FilterContext);
  const [isOpen, setIsOpen] = useState(false);
  const toggleFlavor = () => setIsOpen(!isOpen);

  const { flavors, selectedFlavors, handleFlavors } = context;

  return (
    <div className="collection-collapse-block open">
      <h3 className="collapse-block-title" onClick={toggleFlavor}>
        Flavors
      </h3>
      <Collapse isOpen={isOpen}>
        <div className="collection-collapse-block-content">
          <div className="collection-brand-filter">
            {flavors && flavors.map((flavor, index) => (
              <div
                className="form-check custom-checkbox collection-filter-checkbox"
                key={index}
              >
                <Input
                  checked={selectedFlavors.includes(flavor)}
                  onChange={(e) => {
                    handleFlavors(flavor, e.target.checked);
                  }}
                  type="checkbox"
                  className="custom-control-input"
                  id={flavor}
                />
                <label className="custom-control-label" htmlFor={flavor}>
                  {flavor}
                </label>
              </div>
            ))}
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Flavor;