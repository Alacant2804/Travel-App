import './Button.css';

export default function Button({ text, onClick, type = 'button', className = '' }) {
    return (
        <button type={type} className={`btn ${className}`} onClick={onClick}>
            {text}
        </button>
    );
}