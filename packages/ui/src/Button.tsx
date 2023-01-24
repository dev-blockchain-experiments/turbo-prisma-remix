import * as React from "react";
import {} from "@remix-run/react";

const enum ActionTypes {
  SUBMIT = "SUBMIT",
  THEME = "THEME"
}
interface IButtonProps extends HTMLButtonElement {
  buttonColor: string
  buttonText: string 
};

interface IActionButtonProps extends IButtonProps {
  action: keyof ActionTypes
}
export const RemixButton: React.FC<IButtonProps> = ({buttonColor, buttonText, ...props}) => {
  return (
  <button 
  className={buttonColor}
  ...props
  >{buttonText}</button>
  );
};

export const ActionButton: React.FC<IActionButtonProps> = ({ buttonColor, buttonText, action, ...props }) => {
  const [clicked, setClicked] = React.useState(false);
  React.useEffect(() => {
    if (clicked === true) {
      useSubmit(`/submit?action=${action}`, action);
      setClicked(false);
    }
  }, [clicked]);

  const handleClick: React.MouseEvent<HTMLButtonElement> = React.useCallback((e: React.MouseEvent) => {
  e.preventDefault();
  setClicked(true);
  }, []);
  return (
    <RemixButton 
    buttonColor={buttonColor}
    buttonText={buttonText}
    onClick={handleClick}
    ...props
    ></RemixButton>
  )
}