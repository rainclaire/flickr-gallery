import React from 'react';

const Button = ({onClick, text, disabled, classes}) => {
    const getClasses = () => {
        let buttonClass = '';
        if (disabled) {
            buttonClass += 'button-disabled ';
        }
        if (classes) {
            buttonClass += classes;
        }
        return buttonClass;
    };

    return (
        <button className={getClasses()} disabled={disabled} onClick={onClick}>{text}</button>
    )
};

export default Button;
