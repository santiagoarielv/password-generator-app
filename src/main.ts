import "./style.css";

interface Options {
  len: number;
  num?: boolean;
  sym?: boolean;
  upper?: boolean;
  lower?: boolean;
}

const Color: Record<number, string> = {
  1: "text-red-500",
  2: "text-orange-500",
  3: "text-yellow-500",
  4: "text-green-500",
};

const Strength: Record<number, string> = {
  1: "Too Weak",
  2: "Weak",
  3: "Medium",
  4: "Strong",
};

const range = document.querySelector("input[type=range]") as HTMLInputElement;
const form = document.querySelector("form") as HTMLFormElement;
const input = document.getElementById("password")! as HTMLInputElement;
const button = document.getElementById("copy") as HTMLButtonElement;
const indicatorWrapper = document.getElementById("strength")!;
const indicatorText = document.getElementById("strength-text")!;

const uppercase = /[A-Z]/;
const lowercase = /[a-z]/;
const number = /\d/;
const specialChar = /[!@#$%^&*()\-_=+[\]{}|;:',.<>/?\\]/;

button.addEventListener("click", onCopy);
form.addEventListener("submit", onSubmit);
range.addEventListener("input", onLoad);

function generatePassword({ len, num, sym, upper, lower }: Options) {
  const numbers = "0123456789";
  const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowers = "abcdefghijklmnopqrstuvwxyz";
  const symbols = "!@#$%^&*()-_=+[]{}|;:,.<>?";
  let chars = "";
  let password = "";

  if (num) chars += numbers;
  if (upper) chars += uppers;
  if (lower) chars += lowers;
  if (sym) chars += symbols;

  for (let i = 0; i < len; i++) {
    const indexChar = Math.floor(Math.random() * chars.length);
    password += chars.charAt(indexChar);
  }

  return password;
}

function evaluateStrength(pass: string, minLength: number = 12) {
  let score = 0;

  const containsUpper = uppercase.test(pass);
  const containsLower = lowercase.test(pass);
  const containsNum = number.test(pass);
  const containsSpecial = specialChar.test(pass);

  if (pass.length >= minLength) score++;
  if (containsUpper) score++;
  if (containsLower) score++;
  if (containsNum) score++;
  if (containsSpecial) score++;

  return score >= 4 ? 4 : score;
}

function onSubmit(event: Event): void {
  event.preventDefault();

  const formData = new FormData(form);

  const options = {
    len: parseInt(range.value, 10),
    num: !!formData.get("num"),
    sym: !!formData.get("sym"),
    upper: !!formData.get("upper"),
    lower: !!formData.get("lower"),
  };

  const password = generatePassword(options);

  if (password) {
    input.value = password;

    const level = evaluateStrength(password);
    const strength = Color[level] || Color[1];
    const strengthText = Strength[level] || Strength[1];

    Object.values(Color).forEach((color) => {
      indicatorWrapper.classList.toggle(color, strength === color);
    });

    indicatorText.innerHTML = strengthText;

    for (let i = 0; i < indicatorWrapper.children.length; i++) {
      const child = indicatorWrapper.children[i] as HTMLInputElement;
      child.checked = i < level;
    }
  }
}

function onCopy() {
  if (input.value) {
    navigator.clipboard.writeText(input.value);
  }
}

function onLoad() {
  range.previousElementSibling!.innerHTML = range.value;
}

onLoad();
