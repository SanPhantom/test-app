import "./login.modal.css";

interface LoginModalProps {
  open: boolean;
}

const LoginModal = (props: LoginModalProps) => {
  const { open } = props;

  return <div className="modal-page">Component</div>;
};

export default LoginModal;
