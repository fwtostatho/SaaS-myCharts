import ReturnButton from "../components/returnButton";
import { useSession  } from "next-auth/react"
import IndexButton from "../components/indexButton";


const About = () => {
    const {data, status} = useSession();
    if (status === 'authenticated') {
        return (
            <div>
                {/* Content for "Who We Are" */}
                <section>
                    <h2>Who We Are</h2>
                    <p>
                        At MyCharts, we are passionate about data visualization and empowering our users with powerful
                        charting tools. With years of experience in the industry, our team of skilled developers and
                        designers strive to create intuitive and visually stunning charts that meet the diverse needs of
                        our users. We believe in the power of data to drive insights and inform decision-making. Our
                        goal is to make chart creation accessible, efficient, and enjoyable for everyone, from beginners
                        to advanced users.
                    </p>
                </section>

                {/* Content for "Pricing" */}
                <section>
                    <h2>Pricing</h2>
                    <p>
                        We offer flexible pricing plans to suit the needs of individuals, businesses, and teams. Our
                        pricing is designed to provide value and scalability, whether you're a casual user or a
                        high-demand enterprise.
                    </p>
                </section>

                {/* Content for "For Developers" */}
                <section>
                    <h2>For Developers</h2>
                    <p>Our platform offers a robust API that allows developers to seamlessly integrate our charting
                        capabilities into their own applications. We provide comprehensive documentation and templates
                        to simplify the integration process. Whether you're building a data-driven dashboard or
                        enhancing a reporting tool, our developer-friendly features empower you to create visually
                        compelling charts with ease. We also provide the ability to configure the chart in four file
                        types, PNG, PDF, SVG and HTML.
                    </p>
                </section>
                <ReturnButton/>
            </div>
        );
    }
    else {
        return (
            <div>
                {/* Content for "Who We Are" */}
                <section>
                    <h2>Who We Are</h2>
                    <p>
                        At MyCharts, we are passionate about data visualization and empowering our users with powerful
                        charting tools. With years of experience in the industry, our team of skilled developers and
                        designers strive to create intuitive and visually stunning charts that meet the diverse needs of
                        our users. We believe in the power of data to drive insights and inform decision-making. Our
                        goal is to make chart creation accessible, efficient, and enjoyable for everyone, from beginners
                        to advanced users.
                    </p>
                </section>

                {/* Content for "Pricing" */}
                <section>
                    <h2>Pricing</h2>
                    <p>
                        We offer flexible pricing plans to suit the needs of individuals, businesses, and teams. Our
                        pricing is designed to provide value and scalability, whether you're a casual user or a
                        high-demand enterprise.
                    </p>
                </section>

                {/* Content for "For Developers" */}
                <section>
                    <h2>For Developers</h2>
                    <p>Our platform offers a robust API that allows developers to seamlessly integrate our charting
                        capabilities into their own applications. We provide comprehensive documentation and templates
                        to simplify the integration process. Whether you're building a data-driven dashboard or
                        enhancing a reporting tool, our developer-friendly features empower you to create visually
                        compelling charts with ease. We also provide the ability to configure the chart in four file
                        types, PNG, PDF, SVG and HTML.
                    </p>
                </section>
                <IndexButton/>
            </div>
        );

    }
};


export default About;

