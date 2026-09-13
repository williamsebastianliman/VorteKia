import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router";
import CreateCustomerPage from "./pages/customer_service/CreateCustomerPage";
import UnknownRolePage from "./errors/UnknownRolePage";
import ViewStores from "./pages/store/ViewStores";
import ViewStoreDetail from "./pages/store/ViewStoreDetail";
import CreateSouvenirPage from "./pages/store/CreateSouvenirPage";
import UpdateSouvenirPage from "./pages/store/UpdateSouvenirPage";
import ViewRestaurant from "./pages/restaurant/ViewRestaurants";
import ViewRestaurantDetail from "./pages/restaurant/ViewRestaurantDetail";
import CreateMenuPage from "./pages/restaurant/CreateMenuPage";
import UpdateMenuPage from "./pages/restaurant/UpdateMenuPage";
import ViewRestaurantCustomer from "./pages/customer/restaurant/ViewRestaurantCustomer";
import AssignRideStaffSchedule from "./pages/ride/AssignRideStaffSchedule";
import ViewRide from "./pages/ride/ViewRides";
import AssignMaintenanceTask from "./pages/maintainance_manager/AssignMaintenanceTask";
import ViewQueue from "./pages/ride_staff/ViewQueue";
import ProposeRideRemoval from "./pages/ride/ProposeRideRemoval";
import CreateNewRideProposal from "./pages/ride/CreateNewRideProposal";
import ViewMaintenanceJob from "./pages/maintenance_staff/ViewMaintenanceJob";
import ViewReportJob from "./pages/maintenance_staff/ViewReportJob";
import MakeReport from "./pages/maintenance_staff/MakeReport";
import AssignReportTask from "./pages/maintainance_manager/AssignReportTask";
import ViewMaintenanceTask from "./pages/maintainance_manager/ViewMaintenanceTask";
import ViewReportTask from "./pages/maintainance_manager/ViewReportTask";
import UpdateMaintenanceTask from "./pages/maintainance_manager/UpdateMaintenanceTask";
import ViewDetailedRideCS from "./pages/customer_service/ViewDetailedRideCS";
import ViewDetailedRestaurantCS from "./pages/customer_service/ViewDetailedRestaurantCS";
import ViewRestaurantsCustomer from "./pages/customer/customer/ViewRestaurantsCustomer";
import ViewRidesCustomer from "./pages/customer/customer/ViewRidesCustomer";
import MMManagerGC from "./pages/maintainance_manager/MMManagerGC";
import MSGC from "./pages/maintenance_staff/MSGC";
import RDSGC from "./pages/ride_staff/RDSGC";
import RDMGC from "./pages/ride/RDMGC";
import FNBMGC from "./pages/restaurant/FNBMGC";
import CreateBroadcastMessage from "./pages/customer_service/CreateBroadcastMessage";
import CustomerInbox from "./pages/customer/customer/CustomerInbox";
import ViewRestaurantDetailCustomer from "./pages/customer/restaurant/ViewRestaurantDetailCustomer";
import TopUpPage from "./pages/general/TopUpPage";
import CSOA from "./pages/customer_service/CSOA";
import MakeInquiries from "./pages/customer/customer/MakeInquiries";
import MMOA from "./pages/maintainance_manager/MMOA";
import AWGC from "./pages/general/AWGC";
import RequestMaintenance from "./pages/ride/RequestMaintenance";
import CFGC from "./pages/chef/CFGC";
import WTGC from "./pages/waiter/WTGC";
import SAGC from "./pages/sales_associate/SAGC";
import RMGC from "./pages/store/RMGC";
import CreateStaffPage from "./pages/coo/CreateStaffPage";
import CEOGC from "./pages/ceo/CEOGC";
import COOGC from "./pages/coo/COOGC";
import CFOGC from "./pages/cfo/CFOGC";
import LoginPage from "./pages/general/LoginPage";
import InsertItemLog from "./pages/lnf/InsertItemLog";
import ViewItemLog from "./pages/lnf/ViewItemLog";
import StaffLogin from "./pages/general/StaffLoginPage";
import AllocateChefPage from "./pages/restaurant/AllocateChefPage";
import AllocateWaiterPage from "./pages/restaurant/AllocateWaiterPage";
import UpdateAssignedWaiter from "./pages/restaurant/UpdateAssignedWaiter";
import UpdateAssignedChef from "./pages/restaurant/UpdateAssignedChef";
import CreateNewRestaurantProposal from "./pages/restaurant/CreateNewRestaurantProposal";
import CustomerStatRS from "./pages/customer/restaurant/CustomerStatRS";
import InsertQueue from "./pages/ride_staff/InsertQueue";
import UpdateQueue from "./pages/ride_staff/UpdateQueue";
import ViewQueueCustomer from "./pages/customer/ride/ViewQueueCustomer";
import ViewRideDetailCustomer from "./pages/customer/ride/ViewRideDetailCustomer";
import ViewRideDetail from "./pages/ride/ViewRideDetail";
import ViewRestaurantDetailCF from "./pages/chef/ViewRestaurantDetailCF";
import ViewRestaurantDetailWT from "./pages/waiter/ViewRestaurantDetailWT";
import ViewOrderWaiter from "./pages/waiter/ViewOrderWaiter";
import ChefOrderView from "./pages/chef/ChefOrderView";
import CreateNewStoreProposal from "./pages/store/CreateNewStoreProposal";
import ProposeStoreRemoval from "./pages/store/ProposeStoreRemoval";
import ViewStoreDetailSA from "./pages/sales_associate/ViewStoreDetailSA";
import CustomerStatRD from "./pages/customer/ride/CustomerStatRD";
import CustomerStatST from "./pages/customer/store/CustomerStatST";
import ViewStoreDetailCustomer from "./pages/customer/store/ViewStoreDetailCustomer";
import ViewStoreCustomer from "./pages/customer/store/ViewStoreCustomer";
import ViewMenuCust from "./pages/customer/customer/ViewMenuCust";
import ViewAllRideCOO from "./pages/coo/ViewAllRideCOO";
import ViewMaintenanceTaskCOO from "./pages/coo/ViewMaintenanceTaskCOO";
import ViewRideRemovalCOO from "./pages/coo/ViewRideRemovalCOO";
import ViewNewRideCOO from "./pages/coo/ViewNewRideCOO";
import ViewNewStoreProposalCEO from "./pages/ceo/ViewNewStoreCEO";
import ViewNewRestaurantProposalCEO from "./pages/ceo/ViewNewRestaurantCEO";
import ViewStoreRemovalCEO from "./pages/ceo/ViewStoreRemovalCEO";
import ViewNewRestaurantCFO from "./pages/cfo/ViewNewRestaurantCFO";
import FinanceReportStoreManager from "./pages/store/FinnanceReportStoreManager";
import TransactionDetailRM from "./pages/store/TransactionDetailRM";
import TransactionDetailSA from "./pages/sales_associate/TransactionDetailSA";
import FinnanceSA from "./pages/sales_associate/FinnanceSA";
import ViewAllStoreCFO from "./pages/cfo/ViewAllStoreCFO";
import ViewStoreFinnanceCFO from "./pages/cfo/ViewStoreFinnaceCFO,";
import FinanceReportStoreManagerCEO from "./pages/ceo/marketing/FinnanceReportStoreManagerCEO";
import CreateSouvenirPageCEO from "./pages/ceo/marketing/CreateSouvenirPageCEO";
import TransactionDetailRMCEO from "./pages/ceo/marketing/TransactionDetailRMCEO";
import UpdateSouvenirPageCEO from "./pages/ceo/marketing/UpdateSouvenirPageCEO";
import ViewStoreDetailCEO from "./pages/ceo/marketing/ViewStoreDetailCEO";
import ViewStoresCEO from "./pages/ceo/marketing/ViewStoresCEO";
import AssignReportTaskCEO from "./pages/ceo/maintenance/AssignReportTaskCEO";
import UpdateMaintenanceTaskCEO from "./pages/ceo/maintenance/UpdateMaintenanceTaskCEO";
import ViewMaintenanceTaskCEO from "./pages/ceo/maintenance/ViewMaintenanceTaskCEO";
import ViewReportTaskCEO from "./pages/ceo/maintenance/ViewReportTaskCEO";
import AssignRideStaffScheduleCEO from "./pages/ceo/operational/AssignRideStaffScheduleCEO";
import ViewRideDetailCEO from "./pages/ceo/operational/ViewRideDetailCEO";
import ViewRideCEO from "./pages/ceo/operational/ViewRidesCEO";
import AssignMaintenanceTaskCEO from "./pages/ceo/maintenance/AssignMaintenanceTaskCEO";
import UpdateItemLog from "./pages/lnf/UpdateItemLog";
import NotificationPage from "./pages/customer/customer/NotificationPage";
import LNFGC from "./pages/lnf/LNFGC";
import StaffInbox from "./pages/general/StaffInbox";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="login" element={<LoginPage />} />
      <Route
        path="/staff/cs/registercustomer"
        element={<CreateCustomerPage />}
      />
      <Route path="/staff/login" element={<StaffLogin />} />
      <Route
        path="/staff/coo/registerstaff"
        element={<CreateStaffPage />}
      ></Route>
      <Route path="/error/unknownerror" element={<UnknownRolePage />}></Route>
      <Route path="/staff/lnf/addlog" element={<InsertItemLog />}></Route>
      <Route path="/staff/lnf/viewlog" element={<ViewItemLog />}></Route>
      <Route path="/staff/rm/viewstores" element={<ViewStores />}></Route>
      <Route path="/staff/rm/store/:id" element={<ViewStoreDetail />}></Route>
      <Route
        path="/staff/rm/addsouvenir/:id"
        element={<CreateSouvenirPage />}
      ></Route>
      <Route
        path="/staff/rm/updatesouvenir/:id"
        element={<UpdateSouvenirPage />}
      ></Route>
      <Route
        path="/staff/fnbm/viewrestaurants"
        element={<ViewRestaurant />}
      ></Route>
      <Route
        path="/staff/fnbm/restaurant/:id"
        element={<ViewRestaurantDetail />}
      ></Route>
      <Route
        path="/staff/fnbm/addmenu/:id"
        element={<CreateMenuPage />}
      ></Route>
      <Route
        path="/staff/fnbm/updatemenu/:id"
        element={<UpdateMenuPage />}
      ></Route>
      <Route
        path="/customer/restaurant/viewmenu/:id"
        element={<ViewRestaurantCustomer />}
      ></Route>
      <Route path="/customer/login" element={<LoginPage />}></Route>
      <Route
        path="/staff/rdm/assignstaff/:id"
        element={<AssignRideStaffSchedule />}
      ></Route>
      <Route path="/staff/rdm/viewrides" element={<ViewRide />}></Route>
      <Route path="/staff/rdm/ride/:id" element={<ViewRideDetail />}></Route>
      <Route
        path="/staff/camm/addmaintenancetask"
        element={<AssignMaintenanceTask />}
      ></Route>
      <Route path="/staff/rs/viewqueue" element={<ViewQueue />}></Route>
      <Route
        path="/staff/rdm/proposerideremoval"
        element={<ProposeRideRemoval />}
      ></Route>
      <Route
        path="/staff/rdm/proposenewride"
        element={<CreateNewRideProposal />}
      ></Route>
      <Route
        path="/staff/cnms/viewmaintenancetask"
        element={<ViewMaintenanceJob />}
      ></Route>
      <Route
        path="/staff/camm/addreporttask"
        element={<AssignReportTask />}
      ></Route>
      <Route
        path="/staff/camm/viewreporttask"
        element={<ViewReportTask />}
      ></Route>
      <Route
        path="/staff/camm/viewmaintenancetask"
        element={<ViewMaintenanceTask />}
      ></Route>
      <Route
        path="/staff/cnms/viewreporttask"
        element={<ViewReportJob />}
      ></Route>
      <Route path="/staff/cnms/makereport/:id" element={<MakeReport />}></Route>
      <Route
        path="/staff/camm/updatemaintenancetask/:id"
        element={<UpdateMaintenanceTask />}
      ></Route>
      <Route path="/staff/cs/viewride" element={<ViewDetailedRideCS />}></Route>
      <Route
        path="/staff/cs/viewrestaurant"
        element={<ViewDetailedRestaurantCS />}
      ></Route>
      <Route
        path="/customer/customer/viewrestaurant"
        element={<ViewRestaurantsCustomer />}
      ></Route>
      <Route
        path="/customer/customer/viewride"
        element={<ViewRidesCustomer />}
      ></Route>
      <Route path="/staff/camm/groupchat" element={<MMManagerGC />}></Route>
      <Route path="/staff/cnms/groupchat" element={<MSGC />}></Route>
      <Route path="/staff/rdm/groupchat" element={<RDMGC />}></Route>
      <Route path="/staff/rs/groupchat" element={<RDSGC />}></Route>
      <Route path="/staff/fnbm/groupchat" element={<FNBMGC />}></Route>
      <Route
        path="/customer/restaurant/viewdetail/:id"
        element={<ViewRestaurantDetailCustomer />}
      ></Route>
      <Route
        path="/staff/cs/createbroadcast"
        element={<CreateBroadcastMessage />}
      ></Route>
      <Route
        path="/customer/customer/inbox"
        element={<CustomerInbox />}
      ></Route>
      <Route path="/staff/cs/oa" element={<CSOA />}></Route>
      <Route path="/customer/customer/topup" element={<TopUpPage />}></Route>
      <Route
        path="/customer/customer/makeinquiries"
        element={<MakeInquiries />}
      ></Route>
      <Route path="/staff/camm/oa" element={<MMOA />}></Route>
      <Route path="/staff/groupchat" element={<AWGC />}></Route>
      <Route
        path="/staff/rdm/requestmaintenance"
        element={<RequestMaintenance />}
      ></Route>

      <Route path="/staff/cf/groupchat" element={<CFGC />}></Route>
      <Route path="/staff/wt/groupchat" element={<WTGC />}></Route>
      <Route path="/staff/sa/groupchat" element={<SAGC />}></Route>
      <Route path="/staff/rm/groupchat" element={<RMGC />}></Route>
      <Route path="/staff/ceo/groupchat" element={<CEOGC />}></Route>
      <Route path="/staff/coo/groupchat" element={<COOGC />}></Route>
      <Route path="/staff/cfo/groupchat" element={<CFOGC />}></Route>
      <Route path="/staff/lnf/groupchat" element={<LNFGC />}></Route>
      <Route
        path="/staff/fnbm/allocatechef/:id"
        element={<AllocateChefPage />}
      ></Route>
      <Route
        path="/staff/fnbm/allocatewaiter/:id"
        element={<AllocateWaiterPage />}
      ></Route>

      <Route
        path="/staff/fnbm/updatewaiter/:id"
        element={<UpdateAssignedWaiter />}
      ></Route>
      <Route
        path="/staff/fnbm/updatechef/:id"
        element={<UpdateAssignedChef />}
      ></Route>
      <Route
        path="/staff/fnbm/createrestaurantproposal"
        element={<CreateNewRestaurantProposal />}
      ></Route>
      <Route
        path="/customer/restaurant/customerstat/:id"
        element={<CustomerStatRS />}
      ></Route>

      <Route path="/staff/rs/insertqueue/:id" element={<InsertQueue />}></Route>
      <Route
        path="/staff/rs/updatequeue/:rid/:qn"
        element={<UpdateQueue />}
      ></Route>
      <Route
        path="/customer/ride/viewqueue/:id"
        element={<ViewQueueCustomer />}
      ></Route>
      <Route
        path="/customer/ride/viewdetail/:id"
        element={<ViewRideDetailCustomer />}
      ></Route>
      <Route
        path="/staff/cf/viewrestaurant"
        element={<ViewRestaurantDetailCF />}
      ></Route>
      <Route
        path="/staff/wt/viewrestaurant"
        element={<ViewRestaurantDetailWT />}
      ></Route>
      <Route path="/staff/wt/vieworder" element={<ViewOrderWaiter />}></Route>
      <Route path="/staff/cf/vieworder" element={<ChefOrderView />}></Route>
      <Route
        path="/staff/rm/createproposal"
        element={<CreateNewStoreProposal />}
      ></Route>
      <Route
        path="/staff/rm/createproposal"
        element={<CreateNewStoreProposal />}
      ></Route>
      <Route
        path="/staff/rm/createremovalproposal"
        element={<ProposeStoreRemoval />}
      ></Route>
      <Route path="/staff/sa/viewstore" element={<ViewStoreDetailSA />}></Route>
      <Route
        path="/customer/ride/stat/:id"
        element={<CustomerStatRD />}
      ></Route>

      <Route
        path="/customer/store/customerstat/:id"
        element={<CustomerStatST />}
      ></Route>
      <Route
        path="/customer/store/viewdetail/:id"
        element={<ViewStoreDetailCustomer />}
      ></Route>
      <Route
        path="/customer/store/viewsouvenir/:id"
        element={<ViewStoreCustomer />}
      ></Route>
      <Route
        path="/customer/customer/menu/:id"
        element={<ViewMenuCust />}
      ></Route>

      <Route path="/staff/coo/viewrides" element={<ViewAllRideCOO />}></Route>
      <Route
        path="/staff/coo/maintenance"
        element={<ViewMaintenanceTaskCOO />}
      ></Route>
      <Route
        path="/staff/coo/rideremovalproposal"
        element={<ViewRideRemovalCOO />}
      ></Route>
      <Route
        path="/staff/coo/newrideproposal"
        element={<ViewNewRideCOO />}
      ></Route>

      <Route
        path="/staff/ceo/newstoreproposal"
        element={<ViewNewStoreProposalCEO />}
      ></Route>
      <Route
        path="/staff/ceo/newrestaurantproposal"
        element={<ViewNewRestaurantProposalCEO />}
      ></Route>
      <Route
        path="/staff/ceo/storeremovalproposal"
        element={<ViewStoreRemovalCEO />}
      ></Route>
      <Route
        path="/staff/cfo/newrestaurantproposal"
        element={<ViewNewRestaurantCFO />}
      ></Route>
      <Route
        path="/staff/rm/storereport/:id"
        element={<FinanceReportStoreManager />}
      ></Route>

      <Route path="/staff/rm/td/:id" element={<TransactionDetailRM />}></Route>

      <Route path="/staff/sa/report" element={<FinnanceSA />}></Route>
      <Route path="/staff/sa/td/:id" element={<TransactionDetailSA />}></Route>
      <Route path="/staff/cfo/stores" element={<ViewAllStoreCFO />}></Route>

      <Route
        path="/staff/cfo/storereport/:id"
        element={<ViewStoreFinnanceCFO />}
      ></Route>

      <Route
        path="/staff/ceo/addsouvenir/:id"
        element={<CreateSouvenirPageCEO />}
      />
      <Route
        path="/staff/ceo/storereport/:id"
        element={<FinanceReportStoreManagerCEO />}
      />
      <Route path="/staff/ceo/td/:id" element={<TransactionDetailRMCEO />} />
      <Route
        path="/staff/ceo/updatesouvenir/:id"
        element={<UpdateSouvenirPageCEO />}
      />
      <Route path="/staff/ceo/store/:id" element={<ViewStoreDetailCEO />} />
      <Route path="/staff/ceo/viewstores" element={<ViewStoresCEO />} />

      <Route
        path="/staff/ceo/addmaintenancetask"
        element={<AssignMaintenanceTaskCEO />}
      />
      <Route
        path="/staff/ceo/addreporttask"
        element={<AssignReportTaskCEO />}
      />
      <Route
        path="/staff/ceo/updatemaintenancetask/:id"
        element={<UpdateMaintenanceTaskCEO />}
      />
      <Route
        path="/staff/ceo/viewmaintenancetask"
        element={<ViewMaintenanceTaskCEO />}
      />
      <Route path="/staff/ceo/viewreporttask" element={<ViewReportTaskCEO />} />

      <Route
        path="/staff/ceo/assignstaff/:id"
        element={<AssignRideStaffScheduleCEO />}
      />
      <Route path="/staff/ceo/ride/:id" element={<ViewRideDetailCEO />} />
      <Route path="/staff/ceo/viewrides" element={<ViewRideCEO />} />
      <Route path="/staff/lnf/updatelog/:id" element={<UpdateItemLog />} />
      <Route path="/customer/customer/notif" element={<NotificationPage />} />
      <Route path="/staff/inbox" element={<StaffInbox />} />
    </Routes>
  </BrowserRouter>
);
