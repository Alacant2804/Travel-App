import './PasswordRequirements.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function PasswordRequirements({ password, isVisible }) {
  const isLengthValid = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  if (!isVisible) return null;

  return (
    <div className="password-requirements-modal">
      <ul>
        <li className={isLengthValid ? 'valid' : 'invalid'}>
          {isLengthValid ? <FaCheckCircle className="icon valid" /> : <FaTimesCircle className="icon invalid" />}
          At least 8 characters
        </li>
        <li className={hasNumber ? 'valid' : 'invalid'}>
          {hasNumber ? <FaCheckCircle className="icon valid" /> : <FaTimesCircle className="icon invalid" />}
          At least 2 numbers
        </li>
        <li className={hasSpecialChar ? 'valid' : 'invalid'}>
          {hasSpecialChar ? <FaCheckCircle className="icon valid" /> : <FaTimesCircle className="icon invalid" />}
          At least 1 special character
        </li>
      </ul>
    </div>
  );
}
