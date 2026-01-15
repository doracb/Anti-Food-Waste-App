import { useState, useEffect } from "react";
import {
  getMyFoods,
  addFood,
  deleteFood,
  shareFood,
} from "../services/foodService";
import { getClaimsOnMyFood, updateClaimStatus } from "../services/claimService";
import { getCurrentUser } from "../services/authService";
import {
  FaTrash,
  FaShareAlt,
  FaCheckCircle,
  FaExchangeAlt,
  FaCheck,
  FaTimes,
  FaBell,
} from "react-icons/fa";

import SocialShare from "../components/SocialShare";

export default function Dashboard() {
  const [foods, setFoods] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "General",
    quantity_value: "",
    quantity_unit: "buc",
    expiration_date: "",
  });

  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const [foodsData, claimsData] = await Promise.all([
        getMyFoods(),
        getClaimsOnMyFood(),
      ]);
      setFoods(foodsData);
      setClaims(claimsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    console.log("1. Am apăsat butonul de submit");
    try {
      const payload = {
        ...formData,
        quantity_value: formData.quantity_value
          ? parseFloat(formData.quantity_value)
          : null,
      };

      console.log("2. Datele pregătite pentru trimitere:", payload); // <--- DEBUG verify payload

      console.log("3. Trimit cererea către server...");

      const response = await addFood(payload);

      console.log("4. Răspuns primit de la server:", response);

      setFormData({
        name: "",
        category: "General",
        quantity_value: "",
        quantity_unit: "buc",
        expiration_date: "",
      });

      loadData();
      alert("Produs adăugat cu succes!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (foodId) => {
    if (!window.confirm("Sigur doriți să ștergeți acest produs?")) return;
    try {
      await deleteFood(foodId);
      setFoods(foods.filter((food) => food.id !== foodId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleShare = async (foodId) => {
    try {
      await shareFood(foodId);
      alert("Produsul este acum vizibil si pentru ceilalti utilizatori.");
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleClaimAction = async (claimId, status) => {
    try {
      await updateClaimStatus(claimId, status);
      alert(
        `Cererea a fost ${status === "accepted" ? "acceptată" : "respinsă"}!`
      );
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const getDaysUntilExpiration = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expirationDate = new Date(dateString);
    const diffTime = expirationDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getUrgentFoods = () => {
    return foods.filter(food => {
      const daysLeft = getDaysUntilExpiration(food.expiration_date);
      return daysLeft >= 0 && daysLeft <= 3 && !food.is_available;
    });
  };

  if (!user) {
    return <div style={{ padding: "20px" }}>Vă rugăm să vă autentificați.</div>;
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1>Frigiderul lui {user.name || user.username}</h1>

      {getUrgentFoods().length > 0 && (
        <div style={styles.alertBanner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <FaBell style={{ color: '#856404', fontSize: '1.2rem' }} />
            <strong style={{ fontSize: '1.1rem' }}>Produse care expiră curând!</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
            {getUrgentFoods().map(food => (
              <div key={food.id} style={styles.alertItem}>
                <span>{food.name} ({getDaysUntilExpiration(food.expiration_date)} zile)</span>
                <button 
                  onClick={() => handleShare(food.id)}
                  style={styles.alertShareBtn}
                >
                  <FaShareAlt /> Share
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.formContainer}>
        <h3 style={{ marginTop: 0, marginBottom: "15px" }}>
          Adaugă un produs nou
        </h3>
        <form onSubmit={handleAddSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nume Produs</label>
            <input
              type="text"
              name="name"
              placeholder="ex: Iaurt"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Categoria</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="General">General</option>
              <option value="Lactate">Lactate</option>
              <option value="Legume">Legume</option>
              <option value="Fructe">Fructe</option>
              <option value="Carne">Carne</option>
              <option value="Panificație">Panificație</option>
              <option value="Dulciuri">Dulciuri</option>
              <option value="Băuturi">Băuturi</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Expirare</label>
            <input
              type="date"
              name="expiration_date"
              value={formData.expiration_date}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Cantitate</label>
            <div style={{ display: "flex", gap: "5px" }}>
              <input
                type="number"
                step="0.1"
                name="quantity_value"
                value={formData.quantity_value}
                onChange={handleChange}
                style={{ ...styles.input, flex: 2 }}
                placeholder="0"
              />
              <input
                type="text"
                name="quantity_unit"
                value={formData.quantity_unit}
                onChange={handleChange}
                style={{ ...styles.input, flex: 1, minWidth: "60px" }}
                placeholder="buc"
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button type="submit" style={styles.addButton}>
              + Adaugă
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <p>Se încarcă frigiderul...</p>
      ) : (
        <div style={styles.listContainer}>
          {foods.length === 0 && (
            <p style={{ textAlign: "center", color: "#888" }}>
              Frigiderul este gol. Adaugă primele produse!
            </p>
          )}

          {foods.map((food) => {
            const daysLeft = getDaysUntilExpiration(food.expiration_date);

            const pendingClaim = claims.find(
              (c) => c.food_id === food.id && c.status === "pending"
            );
            const acceptedClaim = claims.find(
              (c) => c.food_id === food.id && c.status === "accepted"
            );

            const claimUser = pendingClaim
              ? pendingClaim.claimant || pendingClaim.User
              : null;
            const acceptedUser = acceptedClaim
              ? acceptedClaim.claimant || acceptedClaim.User
              : null;

            let statusColor = "#28a745";
            let statusText = `${daysLeft} zile rămase`;
            let bgColor = "#fff";

            if (daysLeft < 0) {
              statusColor = "#dc3545";
              statusText = `EXPIRAT`;
              bgColor = "#fff5f5";
            } else if (daysLeft <= 3) {
              statusColor = "#ffc107";
              statusText = `${daysLeft} zile`;
              bgColor = "#fffbf0";
            }

            if (pendingClaim) {
              bgColor = "#e3f2fd";
            } else if (acceptedClaim) {
              bgColor = "#d4edda";
            }

            return (
              <div
                key={food.id}
                style={{
                  ...styles.listItem,
                  backgroundColor: bgColor,
                  borderLeft: pendingClaim
                    ? "5px solid #007bff"
                    : "1px solid #eee",
                }}
              >
                <div
                  style={{
                    flex: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <div style={styles.categoryBadge}>{food.category}</div>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem" }}>
                      {food.name}
                    </h3>
                    <span style={{ color: "#666", fontSize: "0.9rem" }}>
                      Cantitate:{" "}
                      <strong>
                        {food.quantity_value} {food.quantity_unit}
                      </strong>
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    flex: 2,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {pendingClaim ? (
                    <div
                      style={{
                        background: "white",
                        padding: "5px 15px",
                        borderRadius: "20px",
                        border: "1px solid #007bff",
                        color: "#007bff",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <FaBell />
                      Cerere de la:{" "}
                      {claimUser
                        ? claimUser.name || claimUser.username
                        : "Vecin"}
                    </div>
                  ) : acceptedClaim ? (
                    <div style={{ color: "#155724", fontWeight: "bold" }}>
                      Rezervat pentru{" "}
                      {acceptedUser
                        ? acceptedUser.name || acceptedUser.username
                        : "Vecin"}
                    </div>
                  ) : (
                    <span
                      style={{
                        color: statusColor,
                        fontWeight: "bold",
                        border: `1px solid ${statusColor}`,
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                      }}
                    >
                      {statusText}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    flex: 1.5,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  {pendingClaim ? (
                    <>
                      <button
                        onClick={() =>
                          handleClaimAction(pendingClaim.id, "accepted")
                        }
                        style={styles.btnAccept}
                        title="Acceptă"
                      >
                        <FaCheck /> Acceptă
                      </button>
                      <button
                        onClick={() =>
                          handleClaimAction(pendingClaim.id, "rejected")
                        }
                        style={styles.btnReject}
                        title="Respinge"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : acceptedClaim ? (
                    <button
                      onClick={() => handleDelete(food.id)}
                      style={styles.btnDelete}
                      title="Finalizează/Șterge"
                    >
                      <FaTrash /> Predat
                    </button>
                  ) : (
                    <>
                      {food.is_available ? (
                        <span
                          style={{
                            color: "green",
                            fontSize: "0.85rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            background: "#e8f5e9",
                            padding: "5px 10px",
                            borderRadius: "5px",
                          }}
                        >
                          <FaCheckCircle /> Public
                        </span>
                      ) : (
                        daysLeft >= 0 && (
                          <button
                            onClick={() => handleShare(food.id)}
                            style={styles.btnShare}
                            title="Partajează cu vecinii"
                          >
                            <FaShareAlt /> Share
                          </button>
                        )
                      )}
                      <button
                        onClick={() => handleDelete(food.id)}
                        style={styles.btnDelete}
                        title="Șterge"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                  {food.is_available && (
                    <div style={{ marginTop: "5px" }}>
                      <SocialShare
                        foodId={food.id}
                        foodName={food.name}
                        ownerName={user.name || user.username}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  formContainer: {
    backgroundColor: "#f8f9fa",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "40px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr) auto",
    gap: "20px",
    alignItems: "end",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontWeight: "bold",
    fontSize: "0.9rem",
    color: "#555",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ced4da",
    width: "100%",
    boxSizing: "border-box",
    fontSize: "1rem",
  },
  addButton: {
    padding: "12px 25px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    height: "46px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #eee",
    boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
    transition: "transform 0.1s",
  },
  categoryBadge: {
    background: "#e9ecef",
    color: "#495057",
    padding: "6px 12px",
    borderRadius: "15px",
    fontSize: "0.7rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    minWidth: "90px",
    textAlign: "center",
    display: "inline-block",
  },
  btnShare: {
    background: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  btnDelete: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnAccept: {
    background: "#28a745",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  btnReject: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  alertBanner: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffeeba",
    color: "#856404",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "30px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  alertItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: "10px 15px",
    borderRadius: "8px",
    fontSize: "0.95rem",
  },
  alertShareBtn: {
    backgroundColor: "#856404",
    color: "white",
    border: "none",
    padding: "5px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "0.85rem",
    fontWeight: "bold",
  },
};
