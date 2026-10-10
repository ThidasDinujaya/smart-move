
import { useEffect, useState } from 'react';
import { UploadCloud, ImagePlus } from 'lucide-react';

export default function AddVehicle({
  vehicles = [],
  onSave,
  onCancel,
}) {
  const [vehicleNo, setVehicleNo] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState('Active');
  const [serviceDate, setServiceDate] = useState('');

  const [vehicleImage, setVehicleImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);

  const currentYear = new Date().getFullYear();

  // Generate an image preview and release its URL when no longer needed.
  useEffect(() => {
    if (!vehicleImage) {
      setImagePreview('');
      return;
    }

    const previewUrl = URL.createObjectURL(vehicleImage);
    setImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [vehicleImage]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
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
  };

  const handleRemoveImage = () => {
    setVehicleImage(null);

    const imageInput = document.getElementById('vehicleImage');

    if (imageInput) {
      imageInput.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedVehicleNo = vehicleNo.trim();
    const trimmedModel = model.trim();
    const seats = Number(capacity);
    const manufactureYear = Number(year);

    if (!trimmedVehicleNo) {
      window.alert('Please enter the vehicle number!');
      return;
    }

    if (!vehicleType) {
      window.alert('Please select a vehicle type!');
      return;
    }

    if (!brand) {
      window.alert('Please select a brand!');
      return;
    }

    if (!Number.isInteger(seats) || seats <= 0) {
      window.alert('Please enter a valid seating capacity!');
      return;
    }

    if (
      year !== '' &&
      (
        !Number.isInteger(manufactureYear) ||
        manufactureYear < 1990 ||
        manufactureYear > currentYear + 1
      )
    ) {
      window.alert('Please enter a valid manufacture year!');
      return;
    }

    const duplicateVehicle = vehicles.some(
      (vehicle) =>
        String(vehicle.vehicleNo || '')
          .trim()
          .toLowerCase() === trimmedVehicleNo.toLowerCase()
    );

    if (duplicateVehicle) {
      window.alert('Vehicle number already exists!');
      return;
    }

    if (typeof onSave !== 'function') {
      window.alert('Vehicle save function is not connected yet.');
      return;
    }

    const newVehicle = {
      vehicleNo: trimmedVehicleNo,
      type: vehicleType,
      brand,
      model: trimmedModel,
      year,
      capacity: seats,
      status,
      lastService: serviceDate,
    };

    try {
      setSaving(true);

      // Vehicle fields are sent to the parent save handler.
      // Image uploading requires a separate backend/storage integration.
      const result = await onSave(newVehicle);

      if (result !== false) {
        window.alert('Vehicle saved successfully!');
      }
    } catch (error) {
      console.error('Vehicle save error:', error);

      window.alert(
        error instanceof Error
          ? error.message
          : 'Unable to save vehicle.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-page add-vehicle-page">
      {/* Page Header */}
      <div className="form-heading">
        <h1>Add New Vehicle</h1>
        <p>Enter the vehicle details</p>
      </div>

      {/* Vehicle Form */}
      <form
        className="vehicle-form-card"
        onSubmit={handleSubmit}
      >
        <div className="vehicle-form-content">
          {/* Form Fields */}
          <div className="vehicle-fields">
            <div className="form-grid">
              {/* Vehicle Number */}
              <div className="form-group">
                <label htmlFor="vehicleNo">
                  Vehicle No <span>*</span>
                </label>

                <input
                  id="vehicleNo"
                  type="text"
                  placeholder="e.g. NB-1234"
                  value={vehicleNo}
                  onChange={(event) =>
                    setVehicleNo(event.target.value)
                  }
                  required
                />
              </div>

              {/* Manufacture Year */}
              <div className="form-group">
                <label htmlFor="year">
                  Manufacture Year
                </label>

                <input
                  id="year"
                  type="number"
                  min="1990"
                  max={currentYear + 1}
                  placeholder="yyyy"
                  value={year}
                  onChange={(event) =>
                    setYear(event.target.value)
                  }
                />
              </div>

              {/* Vehicle Type */}
              <div className="form-group">
                <label htmlFor="vehicleType">
                  Vehicle Type <span>*</span>
                </label>

                <select
                  id="vehicleType"
                  value={vehicleType}
                  onChange={(event) =>
                    setVehicleType(event.target.value)
                  }
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Bus">Bus</option>
                  <option value="Van">Van</option>
                  <option value="Car">Car</option>
                </select>
              </div>

              {/* Seating Capacity */}
              <div className="form-group">
                <label htmlFor="capacity">
                  Capacity (Seats) <span>*</span>
                </label>

                <input
                  id="capacity"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter capacity"
                  value={capacity}
                  onChange={(event) =>
                    setCapacity(event.target.value)
                  }
                  required
                />
              </div>

              {/* Brand */}
              <div className="form-group">
                <label htmlFor="brand">
                  Brand <span>*</span>
                </label>

                <select
                  id="brand"
                  value={brand}
                  onChange={(event) =>
                    setBrand(event.target.value)
                  }
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

              {/* Status */}
              <div className="form-group">
                <label htmlFor="status">
                  Status <span>*</span>
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  required
                >
                  <option value="Active">
                    Active
                  </option>
                  <option value="In Service">
                    In Service
                  </option>
                  <option value="Under Maintenance">
                    Under Maintenance
                  </option>
                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              {/* Model */}
              <div className="form-group">
                <label htmlFor="model">
                  Model
                </label>

                <input
                  id="model"
                  type="text"
                  placeholder="Enter model"
                  value={model}
                  onChange={(event) =>
                    setModel(event.target.value)
                  }
                />
              </div>

              {/* Last Service Date */}
              <div className="form-group">
                <label htmlFor="serviceDate">
                  Last Service Date
                </label>

                <input
                  id="serviceDate"
                  type="date"
                  value={serviceDate}
                  onChange={(event) =>
                    setServiceDate(event.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Vehicle Image Upload */}
          <div className="vehicle-image-section">
            <label
              className="image-title"
              htmlFor="vehicleImage"
            >
              Vehicle Image
            </label>

            <input
              id="vehicleImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="vehicle-image-input"
              onChange={handleImageChange}
            />

            <label
              className="image-upload-box"
              htmlFor="vehicleImage"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Selected vehicle preview"
                  className="vehicle-image-preview"
                />
              ) : (
                <>
                  <UploadCloud size={42} />
                  <strong>Choose Image</strong>
                  <span>
                    JPG, PNG or WebP (Max 5 MB)
                  </span>
                </>
              )}
            </label>

            {vehicleImage && (
              <div className="vehicle-image-details">
                <p className="selected-image-name">
                  <ImagePlus size={15} />
                  {vehicleImage.name}
                </p>

                <button
                  type="button"
                  className="remove-image-button"
                  onClick={handleRemoveImage}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Form Buttons */}
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
            {saving ? 'Saving...' : 'Save Vehicle'}
          </button>
        </div>
      </form>
    </div>
  );
}
