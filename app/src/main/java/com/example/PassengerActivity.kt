package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.material3.rememberTimePickerState
import androidx.compose.ui.Modifier
import com.example.data.model.RideStatus
import com.example.data.model.UserRole
import com.example.data.model.VehicleType
import com.example.ui.auth.AuthScreen
import com.example.ui.components.PermissionHandler
import com.example.ui.components.ProfileDialogManager
import com.example.ui.components.PushNotificationBanner
import com.example.ui.components.RatingDialog
import com.example.ui.components.ReceiptDialog
import com.example.ui.components.SearchingDriverOverlay
import com.example.ui.components.SosActiveOverlay
import com.example.ui.passenger.ActiveRideTrackingScreen
import com.example.ui.passenger.BookRideScreen
import com.example.ui.passenger.PassengerChatScreen
import com.example.ui.passenger.PassengerHistoryScreen
import com.example.ui.passenger.PassengerHomeScreen
import com.example.ui.passenger.PassengerProfileScreen
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.viewmodel.SwiftRideViewModel

class PassengerActivity : ComponentActivity() {

    private val viewModel: SwiftRideViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewModel.setUserRole(UserRole.PASSENGER) // Set role early
        enableEdgeToEdge()
        setContent {
            val isDarkMode by viewModel.isDarkMode.collectAsState()
            MyApplicationTheme(darkTheme = isDarkMode) {
                SwiftRidePassengerApp(viewModel = viewModel)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SwiftRidePassengerApp(viewModel: SwiftRideViewModel) {
    val isLoggedIn by viewModel.isLoggedIn.collectAsState()
    val userRole by viewModel.userRole.collectAsState()
    val passengerTab by viewModel.passengerTab.collectAsState()
    val currentNotification by viewModel.currentPushNotification.collectAsState()

    PermissionHandler()
    val receiptRide by viewModel.dialogReceiptRide.collectAsState()
    val ratingRide by viewModel.dialogRatingRide.collectAsState()
    val rideStatus by viewModel.rideStatus.collectAsState()
    val isSearching by viewModel.isSearchingForDriver.collectAsState()
    val isSosActive by viewModel.isSosActive.collectAsState()

    var preselectedVehicle by remember { mutableStateOf<VehicleType?>(null) }
    
    val datePickerState = rememberDatePickerState()
    val timePickerState = rememberTimePickerState()

    // Dialogs
    receiptRide?.let { ride ->
        ReceiptDialog(
            ride = ride,
            onDismiss = { viewModel.dismissReceipt() }
        )
    }

    ratingRide?.let { ride ->
        RatingDialog(
            ride = ride,
            onDismiss = { viewModel.dismissRating() },
            onSubmit = { rating, review, tip ->
                viewModel.submitRating(ride.id, rating, review, tip)
            }
        )
    }

    Box(modifier = Modifier.fillMaxSize()) {
        if (!isLoggedIn || userRole != UserRole.PASSENGER) {
            AuthScreen(
                viewModel = viewModel,
                onLoginSuccess = {
                    viewModel.setUserRole(UserRole.PASSENGER)
                }
            )
        } else {
            Scaffold(
                modifier = Modifier.fillMaxSize(),
                bottomBar = {
                    PassengerBottomNav(
                        currentTab = passengerTab,
                        isRideActive = rideStatus == RideStatus.ACCEPTED ||
                            rideStatus == RideStatus.DRIVER_ARRIVED ||
                            rideStatus == RideStatus.IN_PROGRESS,
                        onTabSelected = { tab ->
                            viewModel.setPassengerTab(tab)
                        }
                    )
                }
            ) { innerPadding ->
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(innerPadding)
                ) {
                    Crossfade(targetState = passengerTab, label = "passenger_tabs") { tab ->
                        when (tab) {
                            "Home" -> PassengerHomeScreen(
                                viewModel = viewModel,
                                onNavigateToBook = { vehicle ->
                                    preselectedVehicle = vehicle
                                    viewModel.setPassengerTab("BookRide")
                                },
                                onNavigateToHistory = {
                                    viewModel.setPassengerTab("History")
                                },
                                onNavigateToActiveRide = {
                                    viewModel.setPassengerTab("ActiveRide")
                                }
                            )
                            "BookRide" -> BookRideScreen(
                                viewModel = viewModel,
                                initialVehicle = preselectedVehicle,
                                onBack = { viewModel.setPassengerTab("Home") }
                            )
                            "ActiveRide" -> ActiveRideTrackingScreen(
                                viewModel = viewModel,
                                onNavigateToChat = { viewModel.setPassengerTab("Chat") },
                                onBackToHome = { viewModel.setPassengerTab("Home") }
                            )
                            "History" -> PassengerHistoryScreen(viewModel = viewModel)
                            "Chat" -> PassengerChatScreen(viewModel = viewModel)
                            "Profile" -> PassengerProfileScreen(viewModel = viewModel)
                            else -> PassengerHomeScreen(
                                viewModel = viewModel,
                                onNavigateToBook = { viewModel.setPassengerTab("BookRide") },
                                onNavigateToHistory = { viewModel.setPassengerTab("History") },
                                onNavigateToActiveRide = { viewModel.setPassengerTab("ActiveRide") }
                            )
                        }
                    }
                }
            }
        }

        // Push Notification Banner
        PushNotificationBanner(
            notification = currentNotification,
            onDismiss = { viewModel.dismissPushNotification() },
            onClick = {
                viewModel.setPassengerTab("ActiveRide")
                viewModel.dismissPushNotification()
            }
        )

        if (isSearching) {
            SearchingDriverOverlay()
        }

        if (isSosActive) {
            SosActiveOverlay(onDismiss = { viewModel.dismissSos() })
        }

        ProfileDialogManager(viewModel = viewModel)
    }
}
