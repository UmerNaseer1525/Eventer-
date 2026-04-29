import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./Services/userSlice";
import eventReducer from "./Services/eventSlice";
import categoryReducer from "./Services/categorySlice";
import bookingReducer from "./Services/bookingSlice";
import paymentReducer from "./Services/paymentSlice";
import notificationReducer from "./Services/notificationSlice";
import reportReducer from "./Services/reportSlice";
import adminReducer from "./Services/adminSlice";
import requestReducer from "./Services/requestSlice";
import dashboardReducer from "./Services/dashboardSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    event: eventReducer,
    category: categoryReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    notification: notificationReducer,
    report: reportReducer,
    admin: adminReducer,
    request: requestReducer,
    dashboard: dashboardReducer,
  },
});

export default store;

