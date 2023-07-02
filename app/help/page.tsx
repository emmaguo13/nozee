export default async function IndexPage() {
  return (
    <section className="container grid items-center justify-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[720px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Logging in to nozee
        </h1>
        <br />
        <h1 className="text-2xl font-extrabold leading-tight tracking-tighter md:text-3xl">
          Installing the extension
        </h1>
        <p className="max-w-[700px] text-lg">
          Nozee leverages the power of JWTs, a widely used standard for securely
          transmitting information. When you log in to Nozee, you use a JWT
          obtained from another site, such as ChatGPT, as your authentication
          token. This token contains essential information about you, like your
          email address, securely embedded within it. <br />
          <br />
          To ensure the integrity and authenticity of the JWT, Nozee
          incorporates a robust zero knowledge proof system. This system
          verifies the token without compromising any sensitive information it
          contains. By performing this verification, we can confidently
          authenticate your identity. Additionally, the email address extracted
          from the JWT forms the basis for determining your company affiliation.
        </p>

        <ol className="max-w-[700px] list-decimal text-lg">
          <li>
            <a
              className="underline"
              href="https://zkjwt-zkey-chunks.s3.us-west-2.amazonaws.com/nozee-extension.zip"
            >
              Click here to download the Nozee extension.
            </a>
          </li>
          <li>
            Unzip <code>nozee-extension.zip</code>.
          </li>
          <li>
            Manual Installation: As of now, the Nozee extension is available for
            Chrome users. After downloading the extension, type{" "}
            <code>chrome://extensions</code> into your browser&apos;s address
            bar.
          </li>
          <li>Turn on developer mode in the top right corner.</li>
          <li>
            Select &quot;Load Unpacked&quot; (extension) and point it to the
            extension folder
          </li>
        </ol>
        <br />
        <h1 className="text-2xl font-extrabold leading-tight tracking-tighter md:text-3xl">
          Logging in
        </h1>

        <ol className="max-w-[700px] list-decimal text-lg">
          <li>
            Once you have the Nozee extension installed, navigate to a
            compatible site, such as ChatGPT.
          </li>
          <li>
            Open the Extension and Click &quot;Login to Nozee&quot;. In the
            extension, you can see the contents of the JWT.
          </li>
        </ol>
      </div>
    </section>
  )
}
