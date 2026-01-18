import React from 'react';

function Button({ children, variant = 'secondary', className = '', onClick, style, ...props }) {
    return (
        <button
            className={`btn btn-${variant} ${className}`}
            onClick={onClick}
            style={style}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
