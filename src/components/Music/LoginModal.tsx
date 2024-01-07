import './login.modal.css'
import PhoneLoginForm from './login/PhoneLoginForm'

interface LoginModalProps {
  open: boolean
  onClose?: () => void
}

const LoginModal = (props: LoginModalProps) => {
  const { open, onClose } = props

  return open ? (
    <div className="modal-page">
      <div className="modal-mask" onClick={onClose} />
      <div className="login-modal-container box-shadow">
        <div className="login-modal-title">
          <span>Music Login</span>
        </div>
        <div className="login-type-container">
          <PhoneLoginForm />
        </div>
        <div className="login-tip">
          <span>&copy;san music copywriter</span>
        </div>
      </div>
    </div>
  ) : null
}

export default LoginModal
