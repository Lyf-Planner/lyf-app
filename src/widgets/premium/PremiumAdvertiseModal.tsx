import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { PremiumIcon } from "../../components/Icons";
import AppIntroSlider from "react-native-app-intro-slider";
import { Horizontal } from "../../components/MiscComponents";
import { primaryGreen } from "../../utils/constants";
import { useAuth } from "../../authorisation/AuthProvider";
import { useModal } from "../../components/modal/ModalProvider";

const LOCK_IMAGE = require("../../../assets/images/lock.png");
const ENHANCE_IMAGE = require("../../../assets/images/enhanced.png");
const COLLAB_IMAGE = require("../../../assets/images/collab.jpg");
const NOTIFICATION_IMAGE = require("../../../assets/images/notification.png");

const ADVERTISED_FEATURES = [
  {
    title: "Enhanced Planning",
    text: "Set times, status, descriptions and other details on events",
    image: ENHANCE_IMAGE,
    image_size: 80,
    available: true,
  },

  {
    title: "Push Notifications",
    text: "Notifications for events and checking your timetable",
    image: NOTIFICATION_IMAGE,
    available: true,
    image_size: 80,
  },
  {
    title: "Collaboration",
    text: "Collaborate with friends on group tasks and events",
    image: COLLAB_IMAGE,
    image_size: 85,
    available: false,
  },
  {
    title: "Added Security",
    text: "Options to sign in with 2FA, including Face ID or Touch ID",
    image: LOCK_IMAGE,
    image_size: 85,
    available: false,
  },
];

export const PremiumAdvertiseModal = () => {
  const { data, updateData } = useAuth();
  const { updateModal } = useModal();
  const enablePremium = () => {
    updateData({ ...data, premium: { ...data.premium, enabled: true } });
  };

  const closeModal = () => updateModal(null);

  return (
    <View style={styles.mainContainer}>
      <View style={{ gap: 2 }}>
        <View style={styles.header}>
          <PremiumIcon size={50} />
          <Text style={styles.premiumTitle}>Lyf Premium</Text>
        </View>
        <Text style={styles.subtitle}>
          Unlock more and optimise your schedule
        </Text>
      </View>
      <Horizontal />
      <View style={{ height: 165 }}>
        <AppIntroSlider
          renderItem={PremiumFeature}
          data={ADVERTISED_FEATURES}
          activeDotStyle={styles.activeDotStyle}
          dotStyle={styles.dotStyle}
        />
      </View>
      <View style={styles.footer}>
        <Horizontal />
        <Text style={[styles.subtitle, { marginTop: 8 }]}>
          Premium is currently in development, and can be enabled for{" "}
          <Text style={styles.freeText}>free!</Text>
        </Text>
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            onPress={closeModal}
            style={[styles.bottomButton, { opacity: 0.5 }]}
            activeOpacity={1}
          >
            <Text style={styles.bottomButtonText}>Not Interested</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              enablePremium();
              closeModal();
            }}
            style={[styles.bottomButton, { backgroundColor: primaryGreen }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.bottomButtonText, styles.enablePremiumText]}>
              Enable Premium
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const PremiumFeature = ({ item, dimensions }: any) => {
  return (
    <View
      style={[styles.featureContainer, { opacity: item.available ? 1 : 0.5 }]}
    >
      <View>
        <Image
          source={item.image}
          style={{
            width: item.image_size,
            height: item.image_size,
          }}
        />
      </View>
      <View style={styles.featureSummary}>
        <Text style={styles.featureTitle}>
          {item.title} {!item.available && "(Soon)"}
        </Text>
        <Text style={styles.featureDesc}>{item.text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginHorizontal: 20,

    borderColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderRadius: 10,
    gap: 10,

    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  header: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  premiumTitle: { fontSize: 20, fontWeight: "700" },
  subtitle: { textAlign: "center", opacity: 0.6, fontWeight: "600" },
  featureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
    marginTop: 12,
    gap: 12,
    width: "65%",
  },
  featureSummary: {
    flexDirection: "column",
    gap: 6,
  },
  featureTitle: {
    fontWeight: "600",
    fontSize: 20,
  },
  featureDesc: {
    fontSize: 15,
  },
  activeDotStyle: { backgroundColor: "black", marginBottom: 10 },
  dotStyle: { backgroundColor: "rgba(0,0,0,0.3)", marginBottom: 10 },
  footer: { gap: 10, position: "relative", bottom: 30 },
  freeText: { fontWeight: "800", opacity: 1 },
  bottomButtonsContainer: { flexDirection: "row", gap: 5, marginTop: 8 },
  bottomButton: {
    padding: 15,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 10,
  },
  bottomButtonText: {
    fontSize: 16,
  },
  enablePremiumText: { fontWeight: "600", color: "white" },
});
