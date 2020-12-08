const input = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`

const passports = input.split("\n\n")

MotherTode`
Language :: Expression >> (kv) => kv.output.byr && kv.output.iyr && kv.output.eyr && kv.output.hgt && kv.output.hcl && kv.output.ecl && kv.output.pid
Expression :: KeyValues | KeyValue
KeyValues :: KeyValue (" " | "\n") Expression >> ([kv1, _, kv2]) => ({...kv1.output, ...kv2.output})
KeyValue :: Byr | Iyr | Eyr | Hgt | Hcl | Ecl | Pid | Cid
Cid :: "cid:" Value >> () => ({cid: true})
Pid :: "pid:" Id >> () => ({pid: true})
Ecl :: "ecl:" EyeColour >> () => ({ecl: true})
Hcl :: "hcl:" HexCode >> () => ({hcl: true})
Hgt :: "hgt:" Number Unit >> ([_, n, unit]) => ({hgt: (unit.output === "in"? (n.output >= 59 && n.output <= 76) : (n.output >= 150 && n.output <= 193))})
Eyr :: "eyr:" Year >> ([_, year]) => ({eyr: (year.output >= 2020 && year.output <= 2030)})
Iyr :: "iyr:" Year >> ([_, year]) => ({iyr: (year.output >= 2010 && year.output <= 2020)})
Byr :: "byr:" Year >> ([_, year]) => ({byr: (year.output >= 1920 && year.output <= 2002)})
Year :: Digit Digit Digit Digit >> (year) => parseInt(year.output)
Digit :: /[0-9]/ 
Number :: Digit+ >> (n) => parseInt(n.output)
Unit :: "in" | "cm"
Value :: /[^ \\n]/+
HexChar :: /[0-9a-f]/
HexCode :: "#" HexChar HexChar HexChar HexChar HexChar HexChar
EyeColour :: "amb" | "blu" | "brn" | "gry" | "grn" | "hzl" | "oth"
Id :: Digit Digit Digit Digit Digit Digit Digit Digit Digit
`

passports.map(passport => TERM.Language(passport).output).d.filter(a => a).length.d

