const rtlFieldStyle = {
        '& .MuiInputLabel-root': {
            left: 'inherit',
            right: '1.75rem', // Moves label to the right
            transformOrigin: 'right',
        },
        '& .MuiInputLabel-shrink': {
            transform: 'translate(0, -1.5px) scale(0.75)',
            right: '1.4rem',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            textAlign: 'right',
        },
        '& input': {
            textAlign: 'right', // Ensures typing starts from the right
        },
    };

    export default rtlFieldStyle;