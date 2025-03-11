import "./ModalLoading.css";

const ModalLoading = ({ size }) => {
  return (
    <div className="modal-loading-container">
      <div
        className="modal-spinner"
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
};

export default ModalLoading;
