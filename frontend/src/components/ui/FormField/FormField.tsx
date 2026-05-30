import type {
    InputHTMLAttributes,
    ReactNode,
    SelectHTMLAttributes,
    TextareaHTMLAttributes,
} from 'react';

import './FormField.scss';

type FieldControlProps =
    | ({ as?: 'input' } & InputHTMLAttributes<HTMLInputElement>)
    | ({ as: 'select'; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>)
    | ({ as: 'textarea' } & TextareaHTMLAttributes<HTMLTextAreaElement>);

interface FormFieldProps {
    label: string;
    htmlFor: string;
    fullWidth?: boolean;
    controlProps: FieldControlProps;
}

export function FormField({
    label,
    htmlFor,
    fullWidth = false,
    controlProps,
}: FormFieldProps) {
    const { as = 'input', ...props } = controlProps;

    return (
        <div className={`form-field ${fullWidth ? 'form-field--full' : ''}`.trim()}>
            <label htmlFor={htmlFor}>{label}</label>
            {as === 'select' ? (
                <select id={htmlFor} {...(props as SelectHTMLAttributes<HTMLSelectElement>)}>
                    {(controlProps as { children: ReactNode }).children}
                </select>
            ) : as === 'textarea' ? (
                <textarea id={htmlFor} {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
            ) : (
                <input id={htmlFor} {...(props as InputHTMLAttributes<HTMLInputElement>)} />
            )}
        </div>
    );
}
