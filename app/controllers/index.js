var fcm = require('firebase.cloudmessaging');

const channel = Ti.Android.NotificationManager.createNotificationChannel({
	id: 'default',
	name: 'Default channel',
	importance: Ti.Android.IMPORTANCE_HIGH,
	enableLights: true,
	enableVibration: true,
	showBadge: true
});
fcm.notificationChannel = channel;

fcm.addEventListener("success", function(e) {
	console.log("got permission");
});
fcm.addEventListener("error", function(e) {
	console.log(e.message);
});
fcm.addEventListener("didRefreshRegistrationToken", function(e) {
	console.log("New token", e.fcmToken);
});
fcm.addEventListener("didReceiveMessage", onMessage);

function onMessage(e) {
	$.text.value = "Got message:\n" + JSON.stringify(e);
}

function checkIntent() {
	var message = Titanium.Android.currentActivity.intent.getStringExtra("fcm_data");
	$.intentText.value = "Intent:\n" + message
	// fcm.clearLastData();
}

function onOpen() {
	console.log('old FCM-Token: ' + fcm.fcmToken);

	Ti.Network.registerForPushNotifications({
		success: function() {
			fcm.registerForPushNotifications();
		},
		error: function(e) {
			console.log("error", e)
		},
		callback: onMessage
	});

	checkIntent()
}

Ti.App.addEventListener("resumed", function() {
	checkIntent()
});

$.index.open();
