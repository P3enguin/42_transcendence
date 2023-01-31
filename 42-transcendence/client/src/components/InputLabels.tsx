import * as React from 'react';

function InputLabels(
    {_className,labelName, value, disabled}:{_className:string,labelName?:string,value?:string,disabled?:boolean}
    ) {
    return (
                <input className={_className} type="text" value={value} disabled={disabled} ></input>
            );
}

export default InputLabels;