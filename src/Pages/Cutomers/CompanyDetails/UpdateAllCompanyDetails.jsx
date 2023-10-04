import React, { useState, useEffect } from "react";
import { BankDetails } from "../BankDetails/BankDetails";
import { ContactDetails } from "../ContactDetails/ContactDetails";
import { WareHouseDetails } from "../WareHouseDetails/WareHouseDetails";
import { UpdateCompanyDetails } from "./UpdateCompanyDetails";
import { SecurityChequesDetails } from "../SecurityCheckDetails/SecurityChequesDetails";
import { ForecastView } from "../ForecastDetails/ForecastView";
import { CustomTabs } from "../../../Components/CustomTabs";
import KycUpdate from "../KycDetails/KycUpdate";

export const UpdateAllCompanyDetails = (props) => {
  const { setOpenPopup, getAllCompanyDetails, recordForEdit, product } = props;
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const tabs = [
    { label: "Company" },
    { label: "Bank" },
    { label: "Contact" },
    { label: "WareHouse" },
    { label: "Security Cheques" },
    { label: "Forecast" },
    { label: "KYC" },
  ];

  return (
    <div>
      <div>
        <CustomTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <div style={{ marginTop: "10px" }}>
          {activeTab === 0 && (
            <div>
              <UpdateCompanyDetails
                setOpenPopup={setOpenPopup}
                getAllCompanyDetails={getAllCompanyDetails}
                recordForEdit={recordForEdit}
                product={product}
              />
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <BankDetails recordForEdit={recordForEdit} />
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <ContactDetails recordForEdit={recordForEdit} />
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <WareHouseDetails recordForEdit={recordForEdit} />
            </div>
          )}
          {activeTab === 4 && (
            <div>
              <SecurityChequesDetails recordForEdit={recordForEdit} />
            </div>
          )}
          {activeTab === 5 && (
            <div>
              <ForecastView recordForEdit={recordForEdit} />
            </div>
          )}
          {activeTab === 6 && (
            <div>
              <KycUpdate recordForEdit={recordForEdit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
