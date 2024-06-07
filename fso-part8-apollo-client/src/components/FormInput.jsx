const FormInput = ({ setValue, value, label }) => {
  return (
    <div>
      {label} {' '}
      <input value={value} onChange={({ target }) => setValue(target.value)} />
    </div>
  )
}

export default FormInput
