import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useLogout } from "../app/hooks/useLogout";


export default function LogoutButton() {
    const { handleLogout } = useLogout()

  return (
    <TouchableOpacity onPress={handleLogout} className="p-2">
      <Feather name="log-out" size={24} color="#E0245E" />
    </TouchableOpacity>
  )
}