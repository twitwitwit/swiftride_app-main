package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.Chat
import androidx.compose.material.icons.filled.DirectionsCar
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.RideStatus
import com.example.data.model.UserRole
import com.example.data.model.VehicleType
import com.example.ui.auth.AuthScreen
import com.example.ui.components.PermissionHandler
import com.example.ui.components.PushNotificationBanner
import com.example.ui.components.RatingDialog
import com.example.ui.components.ProfileDialogManager
import com.example.ui.components.ReceiptDialog
import com.example.ui.components.SearchingDriverOverlay
import com.example.ui.components.SosActiveOverlay
import com.example.ui.driver.DriverChatScreen
import com.example.ui.driver.DriverEarningsScreen
import com.example.ui.driver.DriverHomeScreen
import com.example.ui.driver.DriverProfileScreen
import com.example.ui.driver.DriverTripsScreen
import com.example.ui.passenger.ActiveRideTrackingScreen
import com.example.ui.passenger.BookRideScreen
import com.example.ui.passenger.PassengerChatScreen
import com.example.ui.passenger.PassengerHistoryScreen
import com.example.ui.passenger.PassengerHomeScreen
import com.example.ui.passenger.PassengerProfileScreen
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.SwiftBorder
import com.example.ui.theme.SwiftDark
import com.example.ui.theme.SwiftGold
import com.example.ui.theme.SwiftGoldDark
import com.example.ui.theme.SwiftGoldLight
import com.example.ui.theme.SwiftGreen
import com.example.ui.theme.SwiftRed
import com.example.ui.theme.SwiftTextMuted
import com.example.ui.theme.SwiftTextSecondary
import com.example.ui.theme.SwiftWhite
import com.example.ui.viewmodel.SwiftRideViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: SwiftRideViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val isDarkMode by viewModel.isDarkMode.collectAsState()
            MyApplicationTheme(darkTheme = isDarkMode) {
                SwiftRideApp(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun SwiftRideApp(viewModel: SwiftRideViewModel) {
    val isLoggedIn by viewModel.isLoggedIn.collectAsState()
    val userRole by viewModel.userRole.collectAsState()
    val passengerTab by viewModel.passengerTab.collectAsState()
    val driverTab by viewModel.driverTab.collectAsState()
    val currentNotification by viewModel.currentPushNotification.collectAsState()

    PermissionHandler()
    val receiptRide by viewModel.dialogReceiptRide.collectAsState()
    val ratingRide by viewModel.dialogRatingRide.collectAsState()
    val rideStatus by viewModel.rideStatus.collectAsState()
    val isSearching by viewModel.isSearchingForDriver.collectAsState()
    val isSosActive by viewModel.isSosActive.collectAsState()

    var preselectedVehicle by remember { mutableStateOf<VehicleType?>(null) }

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
        if (!isLoggedIn) {
            AuthScreen(
                viewModel = viewModel,
                onLoginSuccess = {
                    // Logged in
                }
            )
        } else {
            Scaffold(
                modifier = Modifier.fillMaxSize(),
                bottomBar = {
                    if (userRole == UserRole.PASSENGER) {
                        PassengerBottomNav(
                            currentTab = passengerTab,
                            isRideActive = rideStatus == RideStatus.ACCEPTED ||
                                rideStatus == RideStatus.DRIVER_ARRIVED ||
                                rideStatus == RideStatus.IN_PROGRESS,
                            onTabSelected = { tab ->
                                viewModel.setPassengerTab(tab)
                            }
                        )
                    } else {
                        DriverBottomNav(
                            currentTab = driverTab,
                            onTabSelected = { tab ->
                                viewModel.setDriverTab(tab)
                            }
                        )
                    }
                }
            ) { innerPadding ->
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(innerPadding)
                ) {
                    if (userRole == UserRole.PASSENGER) {
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
                    } else {
                        Crossfade(targetState = driverTab, label = "driver_tabs") { tab ->
                            when (tab) {
                                "Home" -> DriverHomeScreen(
                                    viewModel = viewModel,
                                    onNavigateToTrips = { viewModel.setDriverTab("Trips") }
                                )
                                "Trips" -> DriverTripsScreen(viewModel = viewModel)
                                "Chat" -> DriverChatScreen(viewModel = viewModel)
                                "Earnings" -> DriverEarningsScreen(viewModel = viewModel)
                                "Profile" -> DriverProfileScreen(viewModel = viewModel)
                                else -> DriverHomeScreen(
                                    viewModel = viewModel,
                                    onNavigateToTrips = { viewModel.setDriverTab("Trips") }
                                )
                            }
                        }
                    }
                }
            }
        }

        // Overlay Push Notification Banner for live GPS updates and arrival alerts
        PushNotificationBanner(
            notification = currentNotification,
            onDismiss = { viewModel.dismissPushNotification() },
            onClick = {
                if (userRole == UserRole.PASSENGER) {
                    viewModel.setPassengerTab("ActiveRide")
                } else {
                    viewModel.setDriverTab("Home")
                }
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

@Composable
fun PassengerBottomNav(
    currentTab: String,
    isRideActive: Boolean,
    onTabSelected: (String) -> Unit
) {
    NavigationBar(
        modifier = Modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .testTag("passenger_bottom_nav"),
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 8.dp
    ) {
        val items = listOf(
            Triple("Home", "Home", Icons.Default.Home),
            Triple("BookRide", "Book Ride", Icons.Default.DirectionsCar),
            Triple("History", "History", Icons.Default.History),
            Triple("Chat", "Chat", Icons.Default.Chat),
            Triple("Profile", "Profile", Icons.Default.Person)
        )

        items.forEach { (tabKey, label, icon) ->
            val isSelected = currentTab == tabKey
            NavigationBarItem(
                selected = isSelected,
                onClick = { onTabSelected(tabKey) },
                icon = {
                    if (tabKey == "Home" && isRideActive) {
                        BadgedBox(
                            badge = {
                                Badge(
                                    containerColor = SwiftGreen,
                                    modifier = Modifier.size(8.dp)
                                )
                            }
                        ) {
                            Icon(imageVector = icon, contentDescription = label)
                        }
                    } else {
                        Icon(imageVector = icon, contentDescription = label)
                    }
                },
                label = {
                    Text(
                        text = label,
                        fontSize = 10.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = MaterialTheme.colorScheme.onSurface,
                    selectedTextColor = MaterialTheme.colorScheme.onSurface,
                    indicatorColor = SwiftGold,
                    unselectedIconColor = SwiftTextMuted,
                    unselectedTextColor = SwiftTextMuted
                )
            )
        }
    }
}

@Composable
fun DriverBottomNav(
    currentTab: String,
    onTabSelected: (String) -> Unit
) {
    NavigationBar(
        modifier = Modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .testTag("driver_bottom_nav"),
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 8.dp
    ) {
        val items = listOf(
            Triple("Home", "Home", Icons.Default.Home),
            Triple("Trips", "My Trips", Icons.Default.DirectionsCar),
            Triple("Chat", "Chat", Icons.Default.Chat),
            Triple("Earnings", "Earnings", Icons.Default.AccountBalanceWallet),
            Triple("Profile", "Profile", Icons.Default.Person)
        )

        items.forEach { (tabKey, label, icon) ->
            val isSelected = currentTab == tabKey
            NavigationBarItem(
                selected = isSelected,
                onClick = { onTabSelected(tabKey) },
                icon = { Icon(imageVector = icon, contentDescription = label) },
                label = {
                    Text(
                        text = label,
                        fontSize = 10.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = MaterialTheme.colorScheme.onSurface,
                    selectedTextColor = MaterialTheme.colorScheme.onSurface,
                    indicatorColor = SwiftGold,
                    unselectedIconColor = SwiftTextMuted,
                    unselectedTextColor = SwiftTextMuted
                )
            )
        }
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(text = "Hello $name! Welcome to SwiftRide", modifier = modifier)
}

