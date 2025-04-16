#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "AFAdRevenueData.h"
#import "AppsFlyerAttribution.h"
#import "AppsFlyerConsent.h"
#import "AppsFlyerCrossPromotionHelper.h"
#import "AppsFlyerDeepLink.h"
#import "AppsFlyerDeepLinkObserver.h"
#import "AppsFlyerDeepLinkResult.h"
#import "AppsFlyerLib.h"
#import "AppsFlyerLinkGenerator.h"
#import "AppsFlyerShareInviteHelper.h"
#import "RNAppsFlyer.h"

FOUNDATION_EXPORT double react_native_appsflyerVersionNumber;
FOUNDATION_EXPORT const unsigned char react_native_appsflyerVersionString[];

