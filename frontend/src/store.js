import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./Services/userSlice";
import eventReducer from "./Services/eventSlice";
import categoryReducer from "./Services/categorySlice";
import bookingReducer from "./Services/bookingSlice";
import paymentReducer from "./Services/paymentSlice";
import notificationReducer from "./Services/notificationSlice";
import reportReducer from "./Services/reportSlice";
import adminReducer from "./Services/adminSlice";

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
  },
});

export default store;
