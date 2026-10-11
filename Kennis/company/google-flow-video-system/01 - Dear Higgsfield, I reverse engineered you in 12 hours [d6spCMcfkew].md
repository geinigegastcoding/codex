# Dear Higgsfield, I reverse engineered you in 12 hours

- **Video:** https://www.youtube.com/watch?v=d6spCMcfkew
- **Subtitle language:** en
- **Source:** YouTube subtitles

---

Hi, welcome to this masterclass. My name is Sirio, and this is entirely AI. I'll show you. So that's me in a scene
that I was never actually in, and I didn't even use any app to make it. And this is
what actually happens when you try to do it the normal way. I'm uploading that same
template video into Seedance 2.5 and asking you to swap me in. Blocked. But apps
like Higgsfield's Genjutsu do this exact thing all day, every day
with these exact videos. So how the f*** are
they getting around it? Hey friend, welcome back. Today we're
going to reverse engineer Higgsfield's Genjutsu and we're going to get around the
IP blocks in Seedance 2.5 so that you guys can put yourself into pretty much any movie
scene or talking head you want without any special software. A quick
heads up before we start. This video is for
educational purposes only. I basically want you to understand how
these AI models actually work and what they can really do. And this might end up being
the first episode of a new series where I actually show you guys the stuff
that they do not want you to know. And by they, you know
what I'm talking about. Okay, so no fluff. Here's
how this is going to work. We're going to start by doing
the whole thing by hand. Okay, it's actually going to break on us
twice and we're going to fix both times. At every step along the way, I'm going to
pause and tell you why it works and not just what to click. And then I'm going to
give you the AI or the automatic version, the agent version, though the workflow so
that you can turn it into a template for your own stuff. And in the next videos,
we're going a lot further and we're going to make things like this. I'm Kim
Kardashian and this is masterclass. I'm Cereo and this is your time
to build something of your own. Cut. Good job. So what do you think? Was it any good? Man, you killed it. But first the basics. So let's not waste any more time. You guys have all seen these videos
that are basically everywhere right now. And the way that it works is that you upload
a photo of yourself and then you pick a template video and then it just swaps you
in for the person that is in that template video. It's the same moves, the same
everything, the same lip syncing. And most people get this from one of those
wrapper apps that sells it as a feature. And like I've said before, that's really
the whole reason that the wrapper works and good for them. What I mean by that is that
they are selling to you an API workflow. It is not the AI model. It's the workflow. It's the thinking. They are selling you
the thinking that they do for you and you just press a button. And so this tutorial
is for those people who actually want to build that button. I spend the last
12 to 24 hours on this going through open source models, masking, cutting people
out and a whole bunch of other subs that didn't work. And I ended up with the
one that I'm going to show you today. So let's go back to that blog
generation from the start. This is the template. And all I did
here was I head over to CDense 2.5. I uploaded this exact video and I typed
replace the character in the video with the picture that I uploaded. And it got blocked
for IP, which I mean, sure, it makes sense. These people are famous. But like I said, this exact video
works totally fine in Genjutsu. But before we actually build anything,
I think that it is important for us to understand why because if you get this part,
the rest of the video is basically just just details. There are really only
two things that get you blocked here. The first one is the face.
The second one is the music. And the way that I like to think about
this is that the video is really carrying these two things at the same time. It's carrying who's in it. So the face,
the voice, the music, and it's carrying how things move. So the motion, the timing
and the lips and the filter, the IP filter only cares about the who. It does not
care about the how and the how is the movement. So the whole idea here is that
you keep the how, the movement and you throw away the who, the IP and everything
that we're going to do from here on out is really just hide one of those two things,
obviously without losing the movement. So the first thing that we're going to
have to do is turn this template into something where the AI cannot tell who
the people are, but he can still see how they move. And for that, we're going to use
something that is called depth anything. You can find it on hugging
phase or replicate or foul. And all you have to do is that you upload
your video, you click generate, and then you get something like this. So this
is what's called the depth mask. And what I mean by this is that it throws
away what everything looks like and it keeps how close or how far
things are from the camera. Like it's the depth. If you've used Photoshop
or or you've done retouching before, it's kind of very similar
to dodge and burn. But in this case, it tracks all the
movements, the movements are still there. But the faces, as you can see,
they're not just a silhouette. This one is from foul. And
this one is from replicate. I like the one from
replicate. Just, I don't know. I just like the colors of
it. There's no difference. You can use the one from foul too. And there's one more thing,
which is the audio, right? If we want the lips to match
the song, then the audio has to go through as well. Now, the first thing
that most people would say is just muted, but we cannot do that. And the reason
why is that AI actually needs to hear the voice in order for it to move the mouth. So instead of muting it, we're going to
keep the voice, but get rid of everything else. Keep the actual words, remove the
soundtrack, remove the background music. So what I'm going to do is that I'm going
to take this depth mask and bring it into cap cut. And I'm just going to make
a new project and drag the clip in. And then I'm going to click on it. And over here on the right hand side, I'm
going to go to audio, then voice changer, then voice filters, then
I'm going to pick pitch up. This is a voice filter. And what it does,
it just changes the pitch of the music. And then once that's done,
I'm going back to the basics. I'm going to click on isolate
voice, then keep only the vocals. And so now what's left is basically
only the acapella without the music or soundtrack. So listen to it. So that's both of them hidden. Right. C dense 2.5 isn't going to block this
anymore because there are no faces. There's no music and we still
have all of the movement, right? Pretty neat. Now, instead of giving it
the original video, we're going to give it the depth mask video plus our own
photos and then swap the people in. But there's one problem though, which
is that the depth mask has no idea what the place actually looks like. It
just either like a grayscale version of the depth mask like in FAL
or like this other one here. And I think it's easier to show you guys. So let's run a quick
test in order to do that. We need an API key. So I'm going to grab
my enhancer API key for C dense 2.5 so we can test. And the link for
that is in the description. And yes, it is cheaper than all of the
other platforms that say that they are the cheapest and also doesn't
train on your data. So your stuff is safe. I'm going
to copy the docs right here. And then I'm going to paste
them into codex or Claude. I'm using codex right now. That's really
because I already had this project started in here. It does not mean that I'm endorsing
open AI or anything is just easier for me right now. Hey, can
you set this up for me? And I'm going to head over
to my enhancer API dashboard. I'm going to generate a key, copy it and
I'm going to go back to the agent and I'm going to ask it to make an ENV file, which
is just like a little private file in your folder that holds your keys and
saves the keys in there for safety. So please guys, never ever
paste your keys in the chat. Always put them in an ENV file. I'm going to click on here and I'm going
to paste in my API key and we're all set. And we are ready to generate. But
before we actually make anything, the next thing I want to talk about is
draft mode because a lot of people get this wrong. What I mean by draft mode is CDES
2.5 lets you make a 480p version of your video first over and over
until you like what you see. And then it finishes that exact same video
in 1080p so you don't have to lose any detail. And it's not like an upscaler. It's kind of like doing a
pencil sketch before you paint. You can redo the sketch over and
over again as many times as you want. And then when you're ready, you're like,
cool, I'm going to pay for the paint once. So use draft mode every time that you're
trying to draft something or generate something with CDES. Now let's say that
you get a draft that you really like. What a lot of people will do is they're
going to download it and then upload it right back as the reference video
thinking that's the same thing it is not. And the reason why is that the
draft is tied to a task ID and not the video file. So when you upload that
file again, that's actually totally different kind of request and it
doesn't carry over any of your settings. So there's no promises that you're
going to get the same video back. So basically you do all of the cheap tries
in draft mode and then you only pay for 1080p one time. Hopefully
this makes sense. You're going to see it in action. So I'm just going to drag in the depth
mask, this one, and then the two photos that I want to use, which is me and teen. And if you guys haven't met teen yet, teen
is this little creature that I've made with AI basically my companion. And also a really cool new project that
I'm working on that is also linked in the description as well. And then I'm going
to paste in this really simple replacement prompt. You can screenshot that. And then I'm just basically going to
say, hey, use the draft mode for this generation. Seed ends also needs links, not files. So please throw everything on a temporary
server like cat box or temp files. It's going to host your inputs temporarily
and then you're going to hit enter. And this usually takes about one minute. Okay, cool. So here's what we got. And if you want to grab the video, you can
either get it from the agent or you can go into the logs and use a generic enhancer
dashboard and give it a quick refresh. And it will be sitting right
there with your request ID. That's also going to match your agents. And I mean, it's not great, right? Well, we basically have two problems here. The first one is that it didn't
actually swap me in all the way. So that's my face, but that
it's very much the actor's body with all the long hair. And the second
thing is that the whole thing is just gray. So one way to fix this
is to have the agent describe the studio. And the reason why is like I
said earlier, the depth mask has no idea what the place looks like. And if this was
your reference video, this is why you got back. So that's where the gray comes from. And what I'm going to do is I'm going to
take a screenshot of the original video and I'm going to drop it into the agent. And I'm going to say, Hey, describe this
place for me, but do not describe the people and then update the prompt with
that and send the same request again. So that's the problem that I'm using. You can pause and screenshot this. Since we're doing this with the agent, the
agent knows exactly what they send before and they can just update that request or
update that payload, you don't have to do anything manually because the
agent has context of your workflow. And I'm just going to
hit enter and submit it. Okay, now we have caller, which is nice. That's one of our two problems fixed. But I mean, the other
problem is still there. For some reason, it is still sticking way
too close to the depth mask, which is why it's still the actor's
body. It's not mine. I'm not entirely sure why. I think it's
basically, I don't know, I think it just sees an outline and then it traces it. But I've got one more trick to fix this. So this time, I'm going to grab the original
video and then our depth mask with the changed audio, I'm going to drop the original
clip into cap cut, and then I'm going to put in the depth
mask right on top of it. I'm going to mute the original clip. So the only audio left
is our pitched vocals. And I'm going to click on the depth mask
and go over to the video tab, then the background removal, then click on customer
removal, and just highlight the people. Basically, what this is doing is that it's
cutting out just the people and then it's laying them on top of the original video. Now, why does that work? Well, if you
think about it like now, it's a very different video. We were giving it a depth
mask, which is really just the outline. So it was raising the outline before and
now we are giving it something that that is totally different and it
stops from tracing it. So I don't know. It looks
at the whole thing again. And I'm going to export that.
This is what it looks like. Then I'm going to send it back to the agent
and say, Hey, swap the old sorts video for this new one and make another draft. And look at that. That
worked. That's pretty cool. Okay, so that was basically four moves. We hit the face, we hit the music, we
described the room, and then we laid the people over the real video. And that's way
too much manual work to do every single time. But but you can do all of it with
one click the same way Higgsfield does with the workflow. So I had the
agent turn everything we just did into one. All you need is a replicate
account and I'm giving you a skill that sets everything up. Hugging face is also
optional, just a backup choice. So really quickly it is 11 steps. One, we upload the original video. We keep the original video for
also the final audio to demicus on replicate splits the
vocals from the music. Three rubber band pitches the
vocals up by three semitones. Four, we have depth anything video, which
makes the collared depth video that we talked about. Five, we have Sam three
cutting out all the people on every frame. Six, it puts those depth people
over the original background. Seven, the pitched vocals go
right inside of that video. Eight, you check
everything before it sends. Nine, C dense makes a draft
through enhancer in the edit mode. Ten, it throws away C dense audio and puts
in the whole original soundtrack back. And 11, you approve it. And it makes a
1080p video and you download the final and before I know well but this
workflow is making millions of dollars. Now you don't have to
do any of that yourself. I'll show you all of it running
as soon as it is set up. So this whole thing runs through your
agent and it comes with its own interface. I built all of it for you guys. All you have to do is download the skill,
give it to your agent and then plug in your API keys from enhancer and replicate
so you can grab the skill in the description, grab the folder and we're
going to drag it in and in codecs and we're going to say please read the read me file
and set this up for me and just let the agent do it. The agent is going to set
up everything for you and ask you some questions along the way. And if you don't
want to download the files for whatever reason, you can just ask your agent
to build this workflow over here. So you can just screenshot this or just
give it my video transcript of this YouTube video. Now I already have mine set up
and there are two ways to run this. The first one is you just drop in the
video that you want to change and then the photos that you want to be placed in
the video are like swapped and you say, Hey, run the workflow as simple as that. The second one you do it yourself in the
UI interface and that's what I'm going to do here. So you guys can see every step. So the interface is really just four steps
because you don't see everything that's happening in the back end. You have to
upload, review, draft and export or save. So I'm going to upload my video, which
can be an MP4 or a MOV up to 30 seconds. I'm going to leave it on advanced because
that's the depth workflow we just built. And then I'm going to click prepare. And so right now it's doing steps
through one to seven all by itself. You don't have to do anything. It's
splitting the vocals from the music. It's pitching them up
everything we did in cup cut. And then it's making the depth video,
cutting the people with Sam three laying them over the original background and cleaning
up every little stray or edges that are off from that mask. This is step eight. And it's not going to let me generate
until I've watched the whole thing and I've approved it myself. And the reason
for that is that might be a bad mask. So we don't, I don't want you to
basically just throw money down the drain. AI agents are unpredictable. That's why we make sure that
they check their work every time. So it's checking for holes in
the body, the hair or hands. This one to me looks very clean. So I'm going to prove this. And
then I'm going to add my characters. So character one, that's me. Character
two is optional in this case, it's teen. And then the prompt is already written. And you can edit that if you wish. And I'm going to generate my draft. Cool. So here's our
draft and listen to that. Take notes. That's the original
audio on the pitched one. And I'm pretty happy with this. So I'm going to approve that. And then
it makes the 1080p and puts the original audio back one more time.
And that one does cost extra. And it's never going to do it without
asking you first or approving. Now that workflow is the best one if you
want to bulletproof your generations. And it mostly uses the
audio to match the words. So if your video has no audio,
it will still generate for sure. But there's one more workflow for when
you want the face to move exactly like the original. And it's the same workflow,
but we add what's called a face mash. And what I mean by that, it's a little
wireframe that gets drawn right on top of the face. It's kind of like those dots that
they put on actor spaces in the behind the scene videos, they can track them, the dots
can capture how the face moves and then the computer can totally create a
different character on top of that. So that same thing,
same thing applies here. It's going to track how the face moves
and it's still going to hide the person behind it. And this is actually the
easiest one because it only has two steps. So you can change the pitch, you can add
the face mash and there's no cutting anyone out like that. Like it just removes
all those extra other steps. So if you guys downloaded the project,
you can just ask the agent to use this workflow instead, it's faster. And
it's also right here in the interface. It's just called fast, or you can ask it
to install the face mash tracking and put it on top of the original video. You send that in and you
get something like this. That's dope. That's crazy. So what the
face mash is doing is it's tracking 478 points on the face. So around
the eyes, the lips, the nose, the whole face. And it is drawing
that mash on every single frame. And it saves all of those points with
all the timing in a file that we have set up to be called face landmarks .json. Everything is done and safe for you. You don't have to worry about it. And it uses Google's face landmark model
from Google's official model storage. One heads up though, at least right now,
this works best with one person which is centered talking to the camera. If you have two people moving around, I
would just stick with a depth mask workflow. And if you want to bullet prove this even
more, you can ask the agent to put the face mash on top of the
cut out depth video. So on top of this one right here. And then you get something like this. And then you send that
in as a source video. And again, all of this
works by just talking to it. There's nothing for you
to install yourself. You just ask the agent to set up the Google
Media Pipe Face Landmarker or any other packages. Okay, this
has been a long video. So from here, you guys can
keep making things better. You can add a transcriber. So it writes
down what's said in the video and puts that into the prompt. You could have the agent
watch the original video and describe the movement in detail second by second. And then you can even use your own voice. So you basically make your and I'm here
to spill the secrets behind API's so that you can build
million dollar workflows. That is it. And if you take one thing away
from this video is that everything, every one of these tricks was basically just the
same idea implemented in different ways and methods. You just keep how things move
and you throw away who is in the video. And hopefully you guys know how Genjutsu
actually works now and how to build yourself. I have attached the entire
open source project in the link in the description. So just get it from there. It's free and go make something with it. And in the next one, we're
going to go way past the basics. See you guys there and do not
forget, create without limits. This is Sirio.
