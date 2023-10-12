import { useAsyncEffect } from "ahooks";
import to from "await-to-js";
import { View } from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../services/customer";
import { updateProfileInfo } from "../../slices/profileSlice";

const Home = () => {
  const profile = useSelector((state: any) => state.profile);
  const dispatch = useDispatch();

  useAsyncEffect(async () => {
    if (profile?.token) {
      const [err, res] = await to(getProfile(profile.token));
      if (err) return;
      dispatch(updateProfileInfo(res.data));
    }
  }, [profile?.token]);

  return <View></View>;
};

export default Home;
