import { User as UserType } from "@/Types/Layout";
import { Settings, ShoppingCart, User } from "react-feather";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import DeactivateAccount from "./DeactivateAccount";
import DeleteAccount from "./DeleteAccount";
import Notifications from "./Notifications";
import TabTable from "./TabTable";

const TabProfile = ({ user }: { user: UserType }) => {
  return (
    <div>
      <Tabs>
        <TabList className="nav nav-tabs tab-coupon">
          <Tab className="nav-link">
            <User className="me-2" />
            Profile
          </Tab>
          <Tab className="nav-link">
            <ShoppingCart className="me-2" />
            Orders
          </Tab>
        </TabList>
        <TabPanel>
          <TabTable user={user} />
        </TabPanel>
        <TabPanel>
          none
          {/* <Notifications />
          <DeactivateAccount />
          <DeleteAccount /> */}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TabProfile;
