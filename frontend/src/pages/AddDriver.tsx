import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud } from "lucide-react";

function AddDriver() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [nic, setNic] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [assignedVehicle, setAssignedVehicle] = useState("");
  const [status, setStatus] = useState("Active");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    alert("Driver saved successfully!");
    navigate("/drivers");
  };

  return (
    <div className="form-page">

      {/* Heading */}
      <div className="form-heading">
        <h1>Add New Driver</h1>
        <p>Enter the driver details</p>
      </div>

      {/* Form */}
      <form
        className="vehicle-form-card"
        onSubmit={handleSubmit}
      >

        <div className="vehicle-form-content">

          {/* LEFT SIDE */}
          <div className="vehicle-fields">

            <div className="form-grid">

              <div className="form-group">
                <label>
                  Full Name <span>*</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  NIC <span>*</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter NIC number"
                  value={nic}
                  onChange={(e) =>
                    setNic(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  License No <span>*</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter license number"
                  value={licenseNo}
                  onChange={(e) =>
                    setLicenseNo(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Phone <span>*</span>
                </label>

                <input
                  type="tel"
                  placeholder="e.g. 0771234567"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Assigned Vehicle
                </label>

                <select
                  value={assignedVehicle}
                  onChange={(e) =>
                    setAssignedVehicle(e.target.value)
                  }
                >
                  <option value="">
                    Select Vehicle
                  </option>

                  <option value="NB-1234">
                    NB-1234
                  </option>

                  <option value="WP-5678">
                    WP-5678
                  </option>

                  <option value="CP-9012">
                    CP-9012
                  </option>

                  <option value="EP-3456">
                    EP-3456
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Status <span>*</span>
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  required
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="On Leave">
                    On Leave
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Address</label>

                <input
                  type="text"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                />
              </div>

            </div>

          </div>

          {/* RIGHT SIDE - PHOTO */}
          <div className="vehicle-image-section">

            <label className="image-title">
              Driver Photo
            </label>

            <label className="image-upload-box">

              <UploadCloud size={45} />

              <strong>Choose photo</strong>

              <span>
                JPG, PNG (Max 2MB)
              </span>

              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                hidden
              />

            </label>

          </div>

        </div>

        {/* Buttons */}
        <div className="form-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/drivers")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-button"
          >
            Save Driver
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddDriver;