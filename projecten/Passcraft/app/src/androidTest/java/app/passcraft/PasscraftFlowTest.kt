package app.passcraft

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Assert.*
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class PasscraftFlowTest {
    @get:Rule val rule = createAndroidComposeRule<MainActivity>()

    @Test fun aCustomPassCanBeSavedAndReopenedWithoutAnAccount() {
        rule.onNodeWithText("Create a pass").performClick()
        rule.onNodeWithText("Pass name").performTextInput("Weekend club")
        rule.onNodeWithText("Subtitle (optional)").performTextInput("Member 42")
        rule.onNodeWithText("QR code data (optional)").performScrollTo().performTextInput("member-42")
        rule.onNodeWithText("Save pass").performClick()
        rule.onNodeWithText("Saved on this phone").assertIsDisplayed()
        rule.activityRule.scenario.recreate()
        rule.onNodeWithText("Weekend club").assertIsDisplayed()
        val saved = rule.activity.passes.single { it.title == "Weekend club" }
        assertEquals("member-42", saved.qr)
    }

    @Test fun aPhoneWithoutNfcDoesNotOfferImpossibleScanOrWriteActions() {
        org.junit.Assume.assumeFalse(rule.activity.nfcSupported)
        rule.onNodeWithText("NFC").performClick()
        rule.onNodeWithText("This device has no NFC hardware.").assertIsDisplayed()
        rule.onNodeWithText("Scan a tag").assertIsNotEnabled()
        rule.onNodeWithText("Open Android NFC settings").assertDoesNotExist()
        rule.onNodeWithText("Write tag").performClick()
        rule.onNodeWithText("Write to a tag").assertIsNotEnabled()
    }
}
