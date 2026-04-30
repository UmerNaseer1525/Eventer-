import { createSlice } from "@reduxjs/toolkit";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

const bookingSlice = createSlice({
  name: "booking",
  initialState: [],
  reducers: {
    setBookings: (_state, action) => {
      return Array.isArray(action.payload) ? action.payload : [];
    },
    addBooking: (state, action) => {
      state.push(action.payload);
    },
    updateBooking: (state, action) => {
      const booking = action.payload || {};
      const id = String(booking._id || booking.id || "");
      const index = state.findIndex(
        (item) => String(item._id || item.id) === id,
      );
      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...booking,
          _id: booking._id || state[index]._id,
          id: booking.id || state[index].id,
        };
      }
    },
    deleteBooking: (state, action) => {
      const bookingId = String(action.payload);
      return state.filter(
        (booking) => String(booking._id || booking.id) !== bookingId,
      );
    },
  },
});

export const getAllBookings = () => async (dispatch) => {
  try {
    const response = await fetch("http://localhost:3000/api/bookings", {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(setBookings(data));
    return data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const addBookingAsync = (bookingData) => async (dispatch) => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const attendeeId = storedUser?._id || storedUser?.id;
    const eventId = bookingData?.eventId || bookingData?.event || bookingData?.id;
    const quantity = Number(
      bookingData?.quantity ??
        bookingData?.reservedSeats ??
        bookingData?.number_of_guests ??
        1,
    );
    const totalPrice = Number(
      bookingData?.totalPrice ?? bookingData?.amount ?? bookingData?.price ?? 0,
    );

    if (!attendeeId) {
      throw new Error("Attendee id is required to create a booking");
    }

    if (!eventId) {
      throw new Error("Event id is required to create a booking");
    }

    const response = await fetch("http://localhost:3000/api/bookings", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        event: eventId,
        attendee: attendeeId,
        ticketType: bookingData?.ticketType || "Regular",
        quantity,
        totalPrice,
        paymentStatus: String(bookingData?.paymentStatus || "paid").toLowerCase(),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(getAllBookings());
    return data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const updateBookingAsync = (bookingData) => async (dispatch) => {
  try {
    const id = bookingData?.id || bookingData?._id || bookingData;
    if (!id) {
      throw new Error("Booking id is required to update a booking");
    }

    const response = await fetch(`http://localhost:3000/api/bookings/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        status: bookingData?.status,
        paymentStatus: String(bookingData?.paymentStatus || "").toLowerCase(),
        quantity:
          bookingData?.quantity ??
          bookingData?.reservedSeats ??
          bookingData?.number_of_guests,
        totalPrice:
          bookingData?.totalPrice ?? bookingData?.amount ?? bookingData?.price,
        ticketType: bookingData?.ticketType,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(getAllBookings());
    return data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const deleteBookingAsync = (bookingId) => async (dispatch) => {
  try {
    const id = bookingId?.id || bookingId;
    const response = await fetch(`http://localhost:3000/api/bookings/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(deleteBooking(id));
    dispatch(getAllBookings());
    return data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const updatePaymentStatusAsync = (bookingData) => async (dispatch) => {
  try {
    const id = bookingData?.id || bookingData?._id || bookingData;
    const response = await fetch(
      `http://localhost:3000/api/bookings/${id}/payment-status`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ paymentStatus: bookingData?.paymentStatus }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(getAllBookings());
    return data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const updateQuantityAsync = (bookingData) => async (dispatch) => {
  try {
    const id = bookingData?.id || bookingData?._id || bookingData;
    const response = await fetch(
      `http://localhost:3000/api/bookings/${id}/quantity`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity: bookingData?.quantity }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(getAllBookings());
    return data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const updateTotalPriceAsync = (bookingData) => async (dispatch) => {
  try {
    const id = bookingData?.id || bookingData?._id || bookingData;
    const response = await fetch(
      `http://localhost:3000/api/bookings/${id}/total-price`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          totalPrice: bookingData?.totalPrice ?? bookingData?.amount ?? bookingData?.price,
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(getAllBookings());
    return data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const updateTicketTypeAsync = (bookingData) => async (dispatch) => {
  try {
    const id = bookingData?.id || bookingData?._id || bookingData;
    const response = await fetch(
      `http://localhost:3000/api/bookings/${id}/ticket-type`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ ticketType: bookingData?.ticketType }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(getAllBookings());
    return data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const { setBookings, addBooking, updateBooking, deleteBooking } =
  bookingSlice.actions;
export default bookingSlice.reducer;
