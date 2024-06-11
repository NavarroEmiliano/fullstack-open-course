const FormInput = ({ setValue, value, label, type }) => {
  return (
    <div>
      {label}{' '}
      <input
        value={value}
        type={type}
        onChange={({ target }) => setValue(target.value)}
      />
    </div>
  )
}

export default FormInput
