import React, { useEffect, useState } from "react";


function App() {
  const [appointments, setAppointments] = useState([]);
  const [appointment, setAppointment] = useState({
    patient: { patientId: "" },
    doctor: { doctorId: "" },
    appointmentDate: "",
    appointmentTime: ""
  });

  const API_URL = "http://localhost:8080/api/appointments";

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Cannot reach backend. Make sure Spring Boot is running.");
    }
  };

  // Book appointment
  const bookAppointment = async (e) => {
    e.preventDefault();
    // Prepare payload in required format
    const payload = {
      patient: { patientId: appointment.patient.patientId },
      doctor: { doctorId: appointment.doctor.doctorId },
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime
    };
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Network response was not ok");
      fetchAppointments();
    } catch (error) {
      console.error("Booking error:", error);
      alert("Cannot book appointment. Backend unreachable.");
    }
  };

  // Delete appointment
  const deleteAppointment = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Network response was not ok");
      fetchAppointments();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Handle input changes for nested fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "patientId") {
      setAppointment((prev) => ({
        ...prev,
        patient: { ...prev.patient, patientId: value }
      }));
    } else if (name === "doctorId") {
      setAppointment((prev) => ({
        ...prev,
        doctor: { ...prev.doctor, doctorId: value }
      }));
    } else {
      setAppointment((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Hospital Appointment System</h2>

      <form onSubmit={bookAppointment}>
        <input
          type="number"
          name="patientId"
          placeholder="Patient ID"
          value={appointment.patientId}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="number"
          name="doctorId"
          placeholder="Doctor ID"
          value={appointment.doctorId}
          onChange={handleChange}
          required
        />
        <br /><br />

         <input
          type="date"
          name="appointmentDate"
          value={appointment.appointmentDate}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="time"
          name="appointmentTime"
          value={appointment.appointmentTime}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Book Appointment</button>
      </form>

      <hr />

      <h3>Appointments</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient ID</th>
            <th>Doctor ID</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.appointmentId}>
              <td>{a.appointmentId}</td>
              <td>{a.patient.patientId}</td>
              <td>{a.doctor.doctorId}</td>
              <td>{a.appointmentDate}</td>
              <td>
                <button onClick={() => deleteAppointment(a.appointmentId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
