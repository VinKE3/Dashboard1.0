const [data, setData] = useState({ nombre: "", descripcion: "" });
const [checked, setChecked] = useState(true);
const [checked2, setChecked2] = useState(true);
const [checkedMenus, setCheckedMenus] = useState([]);

const handleChange = ({ target }) => {
  const value = uppercase(target.value);
  setData({ ...data, [target.name]: value });
};
const handleSelectAll = (checked) => {
  if (checked) {
    setValue(items.map((item) => item.value));
  } else {
    setValue([]);
  }
  setChecked(checked);
  setSelectedActions((prev) => ({
    ...prev,
    [selectedMenu]: checked ? items.map((item) => item.value) : [],
  }));
};
const handleMenuClick = (event) => {
  const index = menu.findIndex(
    (item) => item.nombre === event.target.innerText
  );
  setCheckedMenus((prev) => {
    const newArr = [...prev];
    newArr[index] = !newArr[index];
    return newArr;
  });
  setSelectedMenu(event.target.innerText);
  handleSelectAllActions();
};
const handleSelectAllActions = () => {
  setValue(items.map((item) => item.value));
};
