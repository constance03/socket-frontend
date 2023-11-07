import React, { useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [services, setServices] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id: "",
    patient: "",
    category: "",
    createdAt: "",
  });

  const socket = io("http://localhost:5000/HAC");

  socket.on("connect", () => {
    console.log("Conectado ao servidor!");
  });

  socket.on("novo serviço", (data) => {
    setServices([...services, data]);
  });

  function acceptService(id: any) {
    setServices(services.filter((service) => service.id !== id));
    socket.emit("aceitar serviço", id);
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      id: (Math.floor(Math.random() * 100) + 1).toString(),
      createdAt: new Date().toISOString(),
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    socket.emit("receber serviço", formData);
    setFormData({
      id: "",
      patient: "",
      category: "",
      createdAt: "",
    });
  };

  return (
    <div className="App">
      <div className="App-header">
        <h1>Criar serviço</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label htmlFor="patient">Nome do paciente:</label>
            <input
              type="text"
              id="patient"
              name="patient"
              value={formData.patient}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="category">Categoria:</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Criar novo serviço</button>
        </form>
      </div>
      <div className="dashboard">
        <h2>Dashboard</h2>
        <div className="department">
          <h3>Departamento Nutrição</h3>
          <div className="service-list">
            {services.map((service) => (
              <div className="service-card" key={service.id}>
                <p>Número do serviço: {service.id}</p>
                <p>Número do paciente: {service.patient}</p>
                <p>Categoria: {service.category}</p>
                <p>Criado em: {service.createdAt}</p>
                <button onClick={() => acceptService(service.id)}>
                  Aceitar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
