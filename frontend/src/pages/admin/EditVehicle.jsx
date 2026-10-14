
import { useEffect, useState } from 'react';
import { ImagePlus, UploadCloud } from 'lucide-react';
import fileToDataUrl from '../../utils/fileToDataUrl.js';

function EditVehicle({ vehicle, onSave, onCancel }) {
  const [vehicleNo, setVehicleNo] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [capacity, setCapacity] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [status, setStatus] = useState('Active');
  const [serviceDate, setServiceDate] = useState('');
  const [vehicleImage, setVehicleImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!vehicle) return;

    setVehicleNo(vehicle.vehicleNo || '');
    setVehicleType(vehicle.type || vehicle.vehicleType || '');
    setBrand(vehicle.brand || '');
    setModel(vehicle.model || '');
    setYear(String(vehicle.year || ''));
    setCapacity(String(vehicle.capacity ?? ''));
    setFuelType(vehicle.fuelType || '');
    setStatus(vehicle.status || 'Active');
    setServiceDate(
      vehicle.lastService || vehicle.serviceDate || ''
    );
    setVehicleImage(null);
    setImagePreview(vehicle.imageData || '');
  }, [vehicle]);

  useEffect(() => {
    if (!vehicleImage) return undefined;
    const previewUrl = URL.createObjectURL(vehicleImage);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [vehicleImage]);

  if (!vehicle) {
    return (
      <div className="form-page add-vehicle-page">
        <div className="form-heading">
          <h1>Vehicle Not Found</h1>
          <p>
            Please return to Vehicle Management and select
            a vehicle.
          </p>
        </div>

        <button
          type="button"
          className="save-button"
          onClick={onCancel}
        >
          Back to Vehicles
        </button>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedVehicle = {
      ...vehicle,
      vehicleNo: vehicleNo.trim(),
      type: vehicleType,
      vehicleType,
      brand,
      model: model.trim(),
      year,
      capacity: Number(capacity),
      fuelType,
      status,
      lastService: serviceDate,
      serviceDate,
      imageData: vehicleImage ? await fileToDataUrl(vehicleImage) : null,
    };

    if (!updatedVehicle.vehicleNo) {
      window.alert('Vehicle number is required!');
      return;
    }

    if (!vehicleType || !brand || !status) {
      window.alert('Please fill all required fields!');
      return;
    }

    if (
      !Number.isInteger(updatedVehicle.capacity) ||
      updatedVehicle.capacity <= 0
    ) {
      window.alert('Please enter a valid capacity!');
      return;
    }

    if (
      year &&
      (Number(year) < 1990 ||
        Number(year) > new Date().getFullYear() + 1)
    ) {
      window.alert('Please enter a valid manufacture year!');
      return;
    }

    try {
      setSaving(true);

      const result = await onSave(updatedVehicle);

      if (result !== false) {
        window.alert('Vehicle updated successfully!');
      }
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Unable to update vehicle.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-page add-vehicle-page">
      <div className="form-heading">
        <h1>Edit Vehicle</h1>
        <p>Update the vehicle details</p>
      </div>

      <form
        className="vehicle-form-card"
        onSubmit={handleSubmit}
      >
        <div className="vehicle-form-content">
          <div className="vehicle-fields">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="edit-vehicle-no">
                  Vehicle No <span>*</span>
                </label>

                <input
                  id="edit-vehicle-no"
                  type="text"
                  value={vehicleNo}
                  onChange={(e) =>
                    setVehicleNo(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-year">
                  Manufacture Year
                </label>

                <input
                  id="edit-year"
                  type="number"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-type">
                  Vehicle Type <span>*</span>
                </label>

                <select
                  id="edit-type"
                  value={vehicleType}
                  onChange={(e) =>
                    setVehicleType(e.target.value)
                  }
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Bus">Bus</option>
                  <option value="Coach">Coach</option>
                  <option value="Van">Van</option>
                  <option value="Car">Car</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-capacity">
                  Capacity (Seats) <span>*</span>
                </label>

                <input
                  id="edit-capacity"
                  type="number"
                  min="1"
                  step="1"
                  value={capacity}
                  onChange={(e) =>
                    setCapacity(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-fuel-type">Fuel Type</label>
                <select id="edit-fuel-type" value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                  <option value="">Select Fuel Type</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-brand">
                  Brand <span>*</span>
                </label>

                <select
                  id="edit-brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                >
                  <option value="">Select Brand</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Tata">Tata</option>
                  <option value="Ashok Leyland">
                    Ashok Leyland
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-status">
                  Status <span>*</span>
                </label>

                <select
                  id="edit-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="In Service">In Service</option>
                  <option value="Under Maintenance">
                    Under Maintenance
                  </option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-model">Model</label>

                <input
                  id="edit-model"
                  type="text"
                  placeholder="Enter model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-service-date">
                  Last Service Date
                </label>

                <input
                  id="edit-service-date"
                  type="date"
                  value={serviceDate}
                  onChange={(e) =>
                    setServiceDate(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="vehicle-image-section">
            <label className="image-title" htmlFor="edit-vehicle-image">Vehicle Image</label>
            <input
              id="edit-vehicle-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="vehicle-image-input"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                  window.alert('Please select a JPG, PNG or WebP image.');
                  event.target.value = '';
                  return;
                }
                if (file.size > 5 * 1024 * 1024) {
                  window.alert('Image size must be 5 MB or less.');
                  event.target.value = '';
                  return;
                }
                setVehicleImage(file);
              }}
            />
            <label className="image-upload-box" htmlFor="edit-vehicle-image">
              {imagePreview ? <img src={imagePreview} alt="Vehicle preview" className="vehicle-image-preview" /> : (
                <><UploadCloud size={42} /><strong>Choose Image</strong><span>JPG, PNG or WebP (Max 5 MB)</span></>
              )}
            </label>
            {vehicleImage && <p className="selected-image-name"><ImagePlus size={15} /> {vehicleImage.name}</p>}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-button"
            disabled={saving}
          >
            {saving ? 'Updating...' : 'Update Vehicle'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditVehicle;
